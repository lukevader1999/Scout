import { Client } from 'boardgame.io/client';
import { Scout } from './Game.js';
import { initStandardTurn } from './initStandardTurn.js';
import { drawActiveShow } from './drawCards.js';

const debug = true

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
            if (debug) {
                console.log("Updating state")
            }
            this.renderState()
        })
    }

    currentPlayer() {
        return Number(this.latestState.ctx.currentPlayer)
    }

    currentPlayerHand() {
        return this.latestState.G.playerHands[this.currentPlayer()]
    }

    renderState() {
        initStandardTurn(this)
        if (this.latestState.G.activeShow) {
            drawActiveShow(this.latestState.G.activeShow)
        }
    }

}

export const client = new ScoutClient()