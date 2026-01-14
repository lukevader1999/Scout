import { renderCards} from './cardRendering.js'
export class StandardTurnView {
    constructor() {
        this.name = "StandardTurnView"

        let root = document.getElementById("gameContainer")
        root.innerHTML = ""

        // Active show container
        const activeShow = document.createElement('div');
        activeShow.id = 'activeShowContainer';
        activeShow.className = 'active-show-container';
        root.appendChild(activeShow);
        this.activeShow = activeShow

        // Player hand container
        const hand = document.createElement('div');
        hand.id = 'cardContainer';
        hand.className = 'card-container';
        root.appendChild(hand);
        this.hand = hand

        // Controls area (buttons centered)
        const controls = document.createElement('div');
        controls.style.textAlign = 'center';

        // Show button
        const showBtn = document.createElement('button');
        showBtn.id = 'showButton';
        showBtn.textContent = 'Show';
        controls.appendChild(showBtn);
        this.showBtn = showBtn

        // Start Scout button
        const startScoutBtn = document.createElement('button');
        startScoutBtn.id = 'startScouting';
        startScoutBtn.textContent = 'Start Scout';
        controls.appendChild(startScoutBtn);
        this.startScoutBtn = startScoutBtn

        root.appendChild(controls);
    }

    render(state) {
        const activeShow = state?.G?.activeShow
        if (Array.isArray(activeShow)) {
            renderCards("activeShowContainer", activeShow)
        }
        renderCards("cardContainer", state.G.playerHands[Number(state.ctx.currentPlayer)])
    }

    getHighlightedHandIndices() {
        const selectedIndices = Array.from(this.hand.querySelectorAll('.card.highlight'))
            .map(el => Number(el.dataset.index))
            .filter(n => !Number.isNaN(n));
        const startIndex = Math.min(...selectedIndices);
        const endIndex = Math.max(...selectedIndices);
        return [startIndex, endIndex]
    }

    canStartScout() {
        const highlightedElements = Array.from(this.activeShow.querySelectorAll('.card.highlight'))
        if (highlightedElements.length != 1) {
            console.log("You must highlight exactly one card in the active show to start scouting.");
            return false
        }
        const index = highlightedElements[0].dataset.index
        if (index != 0 && index != this.activeShow.childElementCount -1) {
            console.log("You can only scout from the leftmost or rightmost card in the active show.");
            return false
        }
        return true
    }

    getScoutedCardIndex() {
        const highlightedElements = Array.from(this.activeShow.querySelectorAll('.card.highlight'))
        const index = highlightedElements[0].dataset.index
        return index
    }
}