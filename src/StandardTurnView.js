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

        // Player hand container
        const hand = document.createElement('div');
        this.hand = hand
        hand.id = 'cardContainer';
        hand.className = 'card-container';
        root.appendChild(hand);

        // Controls area (buttons centered)
        const controls = document.createElement('div');
        controls.style.textAlign = 'center';

        // Show button
        const showBtn = document.createElement('button');
        this.showBtn = showBtn
        showBtn.id = 'showButton';
        showBtn.textContent = 'Show';
        controls.appendChild(showBtn);

        // Start Scout button
        const startScoutBtn = document.createElement('button');
        startScoutBtn.id = 'startScouting';
        startScoutBtn.textContent = 'Start Scout';
        controls.appendChild(startScoutBtn);

        // Finish Scout button
        const finishScoutBtn = document.createElement('button');
        finishScoutBtn.id = 'finishScouting';
        finishScoutBtn.textContent = 'Finish Scout';
        controls.appendChild(finishScoutBtn);

        root.appendChild(controls);
    }

    getHighlightedHandIndices() {
        const selectedIndices = Array.from(this.hand.querySelectorAll('.card.highlight'))
            .map(el => Number(el.dataset.index))
            .filter(n => !Number.isNaN(n));
        const startIndex = Math.min(...selectedIndices);
        const endIndex = Math.max(...selectedIndices);
        return [startIndex, endIndex]
    }
}