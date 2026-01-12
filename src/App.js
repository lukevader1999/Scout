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
        this.pendingActiveSelection = null; // index of an activeShow card selected before pressing Scout
        this.prevCurrentPlayer = null;
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
                // If the user already selected a valid active-show card, start scouting from it
                if (this.pendingActiveSelection !== null && Array.isArray(this.latestState?.G?.activeShow)) {
                    const idx = this.pendingActiveSelection;
                    const activeShow = this.latestState.G.activeShow;
                    const lastIndex = activeShow.length - 1;
                    if (idx === 0 || idx === lastIndex) {
                        this.startScoutingFromIndex(idx, activeShow);
                        return;
                    }
                }

                // Otherwise enable selecting a card from active show
                this.awaitingShowSelection = true;
                this.scoutingMode = false;
                console.log('Click the leftmost or rightmost card in the active show to scout');
            });
        }
    }

    cancelScouting() {
        this.scoutingMode = false;
        this.awaitingShowSelection = false;
        this.pendingActiveSelection = null;
        this.scoutedCard = null;
        this.scoutedIndex = null;
        this.scoutedSide = null;
        this.previewInsertIndex = 0;
        this.previewRotate = false;

        // clear any preview elements or highlights in the DOM
        const cardContainer = document.getElementById('cardContainer');
        if (cardContainer) {
            // remove preview-card elements if any
            cardContainer.querySelectorAll('.preview-card').forEach(el => el.remove());
            // remove any leftover highlights on the real hand (they will be re-rendered)
            cardContainer.querySelectorAll('.card').forEach(el => el.classList.remove('highlight'));
        }
        const active = document.getElementById('activeShowContainer');
        if (active) active.querySelectorAll('.card').forEach(el => el.classList.remove('highlight'));
    }

    update(state) {
        // Keep latest state for UI handlers
        this.latestState = state;

        const activeShow = state?.G?.activeShow
        const currentPlayer = Number(state?.ctx?.currentPlayer ?? 0)

        // If the turn changed or the activeShow changed (e.g. another player scouted),
        // cancel any in-progress local scouting preview so clicks return to normal.
        if (this.prevCurrentPlayer !== null && this.prevCurrentPlayer !== currentPlayer) {
            if (this.scoutingMode || this.awaitingShowSelection || this.pendingActiveSelection !== null) {
                this.cancelScouting();
            }
        }

        if (this.scoutingMode) {
            // If activeShow no longer contains the card we were previewing, cancel preview.
            if (!Array.isArray(activeShow) || !activeShow.find(c => c.id === this.scoutedCard?.id && (!!c.rotated) === (!!this.scoutedCard?.rotated))) {
                this.cancelScouting();
            }
        }

        // activeShow: render with custom click handler to handle selection when scouting
        if (Array.isArray(activeShow)) {
            renderCards("activeShowContainer", activeShow, {
                onClick: (card, index, wrapper) => {
                    const lastIndex = activeShow.length - 1;

                    // If not in awaiting/selecting or scouting mode, treat this click as a pre-selection
                    if (!this.awaitingShowSelection && !this.scoutingMode) {
                        // allow pre-select only for leftmost/rightmost cards
                        if (index === 0 || index === lastIndex) {
                            this.pendingActiveSelection = index;
                            // clear existing highlights and highlight the selected active-show card
                            const container = document.getElementById('activeShowContainer');
                            if (container) {
                                container.querySelectorAll('.card').forEach(el => el.classList.remove('highlight'));
                                wrapper.classList.add('highlight');
                            }
                            console.log('Active-show card selected. Press Scout to preview and insert.');
                            return;
                        }

                        // otherwise behave like a normal toggle
                        wrapper.classList.toggle('highlight');
                        return;
                    }

                    // If user pressed the Scout button and is awaiting a selection (or is already scouting), start scouting immediately
                    if (index !== 0 && index !== lastIndex) {
                        console.log('Only the leftmost or rightmost card can be scouted.');
                        return;
                    }

                    this.startScoutingFromIndex(index, activeShow);
                }
            })
        }

        // Render player's hand or preview in-place (preview replaces the hand view)
        if (this.scoutingMode) {
            this.renderPreview();
        } else {
            renderCards("cardContainer", state.G.playerHands[currentPlayer]);
            // clear any preview container remnants
            const preview = document.getElementById('previewContainer');
            if (preview) preview.innerHTML = '';
        }

        this.prevCurrentPlayer = currentPlayer;
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

        // Render preview in the same container as the hand so it appears in-place
        renderCards('cardContainer', previewHand, {
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

        // clear the separate preview container if present
        const previewEl = document.getElementById('previewContainer');
        if (previewEl) previewEl.innerHTML = '';
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
            this.pendingActiveSelection = null;
            // clear in-place preview (cardContainer will be re-rendered on next update)
            const preview = document.getElementById('cardContainer');
            if (preview) preview.querySelectorAll('.preview-card').forEach(el => el.remove());
            e.preventDefault();
            return;
        }
        if (e.key === 'Escape') {
            // Cancel scouting
            this.scoutingMode = false;
            this.awaitingShowSelection = false;
            this.scoutedCard = null;
            this.pendingActiveSelection = null;
            // clear any in-place preview highlights
            const container = document.getElementById('activeShowContainer');
            if (container) container.querySelectorAll('.card').forEach(el => el.classList.remove('highlight'));
            e.preventDefault();
            return;
        }
    }

    startScoutingFromIndex(index, activeShow) {
        // prepare preview state from the given index
        this.awaitingShowSelection = false;
        this.scoutingMode = true;
        this.scoutedIndex = index;
        this.scoutedSide = (index === 0) ? 'l' : 'r';
        this.pendingActiveSelection = null;
        // clone card for local preview (don't mutate server state)
        this.scoutedCard = JSON.parse(JSON.stringify(activeShow[index]));
        this.previewRotate = !!this.scoutedCard.rotated;

        // default insert position: end of hand
        const currentPlayer = Number(this.latestState?.ctx?.currentPlayer ?? 0);
        const playerHand = this.latestState?.G?.playerHands[currentPlayer] || [];
        this.previewInsertIndex = playerHand.length;

        // highlight the selected card in the active show
        const container = document.getElementById('activeShowContainer');
        if (container) {
            container.querySelectorAll('.card').forEach(el => el.classList.remove('highlight'));
            // find and highlight the clicked index element if possible
            const elems = container.querySelectorAll('.card');
            if (elems && elems[index]) elems[index].classList.add('highlight');
        }

        // render preview immediately
        this.renderPreview();
    }

}

const app = new ScoutClient()