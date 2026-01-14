import { renderScoutHand } from "./cardRendering"
export class ScoutTurnView {
    constructor(latestState, scoutedCard) {
        this.name = "ScoutTurnView"
        this.latestState = latestState
        this.scoutedCard = structuredClone(scoutedCard)
        this.scoutedCardIndex = this.latestState.G.playerHands[Number(this.latestState.ctx.currentPlayer)].length
        this.playerHand = latestState.G.playerHands[Number(this.latestState.ctx.currentPlayer)]

        let root = document.getElementById("gameContainer")
        root.innerHTML = ""

        // Active show container
        const activeShow = document.createElement('div');
        activeShow.id = 'activeShowContainer';
        activeShow.className = 'active-show-container';
        root.appendChild(activeShow);

        // Player hand container
        const hand = document.createElement('div');
        hand.id = 'cardContainer';
        hand.className = 'card-container';
        root.appendChild(hand);
        this.hand = hand

        // Controls area (buttons centered)
        const controls = document.createElement('div');
        controls.style.textAlign = 'center';

        // Cancel scout button
        const cancelBtn = document.createElement('button');
        cancelBtn.id = 'showButton';
        cancelBtn.textContent = 'Cancel Scout';
        controls.appendChild(cancelBtn);
        this.cancelBtn = cancelBtn

        // Finish Scout button
        const finishScoutBtn = document.createElement('button');
        finishScoutBtn.id = 'finishScouting';
        finishScoutBtn.textContent = 'Finish Scout';
        controls.appendChild(finishScoutBtn);
        this.finishScoutBtn = finishScoutBtn

        root.appendChild(controls);

        // scout move 
        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    this.moveScoutedCardLeft()
                    break

                case 'ArrowRight':
                    this.moveScoutedCardRight()
                    break

                case 'r':
                    this.scoutedCard.rotated = !this.scoutedCard.rotated
                    this.render()
                    break
            }
        })
    }

    moveScoutedCardLeft() {
        if (this.scoutedCardIndex > 0) {
            this.scoutedCardIndex = this.scoutedCardIndex -1
            this.render()
        }
    }

     moveScoutedCardRight() {
        if (this.scoutedCardIndex < this.playerHand.length) {
            this.scoutedCardIndex = this.scoutedCardIndex + 1
            this.render()
        }
    }

    generatePlayerHandWithScoutedCard() {
        let handCopy = [...this.playerHand]
        handCopy.splice(this.scoutedCardIndex, 0, this.scoutedCard)
        return handCopy
    }

    render() {
        renderScoutHand(this.hand.id, this.generatePlayerHandWithScoutedCard(), this.scoutedCardIndex)
    }
}