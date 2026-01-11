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
    }

    update(state) {
        renderCards("cardsContainer", state.G.playerHands[0])
    }

}

const app = new ScoutClient()