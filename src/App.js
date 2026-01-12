import { Client } from 'boardgame.io/client';
import { Scout } from './Game.js';
import { renderCards} from './cardRendering.js'

class ScoutClient {
    constructor() {
        this.client = Client({ 
            game: Scout,
            numPlayers: 4
        });
        this.client.start();
        this.client.subscribe(state => this.update(state))

        // Local UI state for scouting flow
        this.latestState = null;
        this.awaitingShowSelection = false; // waiting for user to click activeShow card after pressing Scout
        this.scoutingMode = false; // true after a valid activeShow card was selected
        this.scoutedSide = null; // 'l' or 'r'
        this.scoutedIndex = null; // index within activeShow selected
        this.scoutedCard = null; // preview copy of the scouted card
        this.previewInsertIndex = 0; // insertion index in player's hand for preview
        this.previewRotate = false; // whether preview card is rotated

        // Global keyboard handler for moving preview, rotating and confirming
        document.addEventListener('keydown', this.onKeyDown.bind(this));

        // Wire the "Play Selected" button to send the `show` move for highlighted cards
        const showButton = document.getElementById('showButton');
        if (showButton) {
            showButton.addEventListener('click', () => {
                const container = document.getElementById('cardContainer');
                if (!container) return;
                const selected = Array.from(container.querySelectorAll('.card.highlight'))
                    .map(el => Number(el.dataset.index))
                    .filter(n => !Number.isNaN(n));
                if (selected.length === 0) {
                    console.log('No cards selected to play');
                    return;
                }
                const startIndex = Math.min(...selected);
                const endIndex = Math.max(...selected);
                this.client.moves.show(startIndex, endIndex);
            });
        }
        
        // Wire the "Scout" button to start selection of a card from the active show
        const scoutButton = document.getElementById('scoutButton');
        if (scoutButton) {
            scoutButton.addEventListener('click', () => {
                // Enable selecting a card from active show
                this.awaitingShowSelection = true;
                this.scoutingMode = false;
                console.log('Click the leftmost or rightmost card in the active show to scout');
            });
        }
    }

    update(state) {
        // Keep latest state for UI handlers
        this.latestState = state;

        const activeShow = state?.G?.activeShow
        const currentPlayer = Number(state?.ctx?.currentPlayer ?? 0)

        // activeShow: render with custom click handler to handle selection when scouting
        if (Array.isArray(activeShow)) {
            renderCards("activeShowContainer", activeShow, {
                onClick: (card, index, wrapper) => {
                    // If user pressed the Scout button and is awaiting a selection
                    if (!this.awaitingShowSelection && !this.scoutingMode) {
                        // default behavior: toggle highlight
                        wrapper.classList.toggle('highlight');
                        return;
                    }

                    // Only leftmost or rightmost card can be scouted in game logic
                    const lastIndex = activeShow.length - 1;
                    if (index !== 0 && index !== lastIndex) {
                        console.log('Only the leftmost or rightmost card can be scouted.');
                        return;
                    }

                    // prepare preview state
                    this.awaitingShowSelection = false;
                    this.scoutingMode = true;
                    this.scoutedIndex = index;
                    this.scoutedSide = (index === 0) ? 'l' : 'r';
                    // clone card for local preview (don't mutate server state)
                    this.scoutedCard = JSON.parse(JSON.stringify(activeShow[index]));
                    this.previewRotate = !!this.scoutedCard.rotated;

                    // default insert position: end of hand
                    const playerHand = state.G.playerHands[currentPlayer] || [];
                    this.previewInsertIndex = playerHand.length;

                    // highlight the selected card in the active show
                    // first clear existing highlights
                    const container = document.getElementById('activeShowContainer');
                    if (container) {
                        container.querySelectorAll('.card').forEach(el => el.classList.remove('highlight'));
                        wrapper.classList.add('highlight');
                    }

                    // render preview immediately
                    this.renderPreview();
                }
            })
        }

        // Render player's hand (base view)
        renderCards("cardContainer", state.G.playerHands[currentPlayer]);

        // If scouting mode active, also render preview container (kept in sync by renderPreview)
        if (this.scoutingMode) {
            this.renderPreview();
        } else {
            // clear preview container when not scouting
            const preview = document.getElementById('previewContainer');
            if (preview) preview.innerHTML = '';
        }
    }

    renderPreview() {
        // Build preview hand: player's hand with the scouted card inserted at previewInsertIndex
        if (!this.latestState || !this.scoutingMode || !this.scoutedCard) return;
        const currentPlayer = Number(this.latestState.ctx.currentPlayer);
        const playerHand = (this.latestState.G.playerHands[currentPlayer] || []).map(c => JSON.parse(JSON.stringify(c)));

        // clone scouted card for preview and apply preview flag and rotation
        const previewCard = JSON.parse(JSON.stringify(this.scoutedCard));
        previewCard._preview = true;
        previewCard.rotated = !!this.previewRotate;

        // clamp insert index
        if (this.previewInsertIndex < 0) this.previewInsertIndex = 0;
        if (this.previewInsertIndex > playerHand.length) this.previewInsertIndex = playerHand.length;

        const previewHand = [...playerHand.slice(0, this.previewInsertIndex), previewCard, ...playerHand.slice(this.previewInsertIndex)];

        renderCards('previewContainer', previewHand, {
            onClick: (card, index, wrapper) => {
                // clicking a slot updates the insert index (if clicking preview card, keep it as that index)
                // The preview array contains the inserted card itself, so find its index
                if (card._preview) {
                    this.previewInsertIndex = index;
                } else {
                    // if clicking another card, decide whether to insert before or after clicked card
                    this.previewInsertIndex = index + 1;
                }
                this.renderPreview();
            }
        });
    }

    onKeyDown(e) {
        if (!this.scoutingMode) return;
        const currentPlayer = Number(this.latestState.ctx.currentPlayer);
        const handLength = (this.latestState.G.playerHands[currentPlayer] || []).length;

        if (e.key === 'ArrowLeft') {
            this.previewInsertIndex = Math.max(0, this.previewInsertIndex - 1);
            this.renderPreview();
            e.preventDefault();
            return;
        }
        if (e.key === 'ArrowRight') {
            this.previewInsertIndex = Math.min(handLength, this.previewInsertIndex + 1);
            this.renderPreview();
            e.preventDefault();
            return;
        }
        if (e.key === 'r' || e.key === 'R') {
            this.previewRotate = !this.previewRotate;
            this.renderPreview();
            e.preventDefault();
            return;
        }
        if (e.key === 'Enter') {
            // Confirm scout move
            try {
                this.client.moves.scout(this.scoutedSide, this.previewRotate, this.previewInsertIndex);
            } catch (err) {
                console.error('Failed to send scout move', err);
            }
            // Clear UI state
            this.scoutingMode = false;
            this.scoutedCard = null;
            this.scoutedIndex = null;
            this.scoutedSide = null;
            this.previewInsertIndex = 0;
            this.previewRotate = false;
            const preview = document.getElementById('previewContainer');
            if (preview) preview.innerHTML = '';
            e.preventDefault();
            return;
        }
        if (e.key === 'Escape') {
            // Cancel scouting
            this.scoutingMode = false;
            this.awaitingShowSelection = false;
            this.scoutedCard = null;
            const preview = document.getElementById('previewContainer');
            if (preview) preview.innerHTML = '';
            const container = document.getElementById('activeShowContainer');
            if (container) container.querySelectorAll('.card').forEach(el => el.classList.remove('highlight'));
            e.preventDefault();
            return;
        }
    }

}

const app = new ScoutClient()