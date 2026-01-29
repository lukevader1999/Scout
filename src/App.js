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
        
        initStandardTurn(this)
    }

    currentPlayer() {
        return Number(this.latestState.ctx.currentPlayer)
    }

    currentPlayerHand() {
        return this.latestState.G.playerHands[this.currentPlayer()]
    }

}

export const client = new ScoutClient()