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
    }

    update(state) {
        const activeShow = state?.G?.activeShow
        if (Array.isArray(activeShow)) {
            renderCards("activeShowContainer", activeShow)
        }
        renderCards("cardContainer", state.G.playerHands[Number(state.ctx.currentPlayer)])
    }

}

const app = new ScoutClient()