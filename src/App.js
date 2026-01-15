import { Client } from 'boardgame.io/client';
import { Scout } from './Game.js';
import {StandardTurnView} from './StandardTurnView.js'
import { ScoutTurnView } from './ScoutTurnView.js';

class ScoutClient {
    constructor() {
        this.client = Client({ 
            game: Scout,
            numPlayers: 2
        });

        this.client.start();
        this.latestState = null
        this.client.subscribe(state => {
            this.latestState = state
            this.update(state)
        })
        
        this.initStandardTurn()
    }

    currentPlayer() {
        return Number(this.latestState.ctx.currentPlayer)
    }

    initScoutTurn() {
        let scoutedSide = this.view.getScouteSide()
        this.view = new ScoutTurnView(this.latestState, scoutedSide)
        //cancel scout button binding
        this.view.cancelBtn.addEventListener('click', () => {
            this.initStandardTurn()
        })

        //finish scout button binding
        this.view.finishScoutBtn.addEventListener('click', () => {
            console.log("Hi")
            this.client.moves.scout(scoutedSide, this.view.scoutedCard.rotated, this.view.scoutedCardIndex)
            this.initStandardTurn()
        })

        this.view.render()
    }

    initStandardTurn() {
        this.view = new StandardTurnView()

        //show button binding
        this.view.showBtn.addEventListener('click', () => {
            let [startIndex, endIndex] = this.view.getHighlightedHandIndices()
            this.client.moves.show(startIndex, endIndex)
        })

        //start scout button binding
        this.view.startScoutBtn.addEventListener('click', () => {
            if (this.view.canStartScout()){
                this.initScoutTurn()
            }
        })

        this.update()
    }

    update(state) {
        state = state || this.latestState;
        if (this.view == null){
            return
        }
        this.view.render(state)
    }
}

const app = new ScoutClient()