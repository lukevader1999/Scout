import { Client } from 'boardgame.io/client';
import { Scout } from './Game.js';
import { initStandardTurn } from './initStandardTurn.js';

class ScoutClient {
    constructor() {
        this.client = Client({ 
            game: Scout,
            numPlayers: 4
        });

        this.client.start();
        this.latestState = null
        this.client.subscribe(state => {
            this.latestState = state
        })
        
        initStandardTurn(this.latestState.G.playerHands[0])
    }

    currentPlayer() {
        return Number(this.latestState.ctx.currentPlayer)
    }

}

const app = new ScoutClient()