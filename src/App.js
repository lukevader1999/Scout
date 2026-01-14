import { Client } from 'boardgame.io/client';
import { Scout } from './Game.js';
import { renderCards} from './cardRendering.js'
import {StandardTurnView} from './StandardTurnView.js'

class ScoutClient {
    constructor() {
        this.client = Client({ 
            game: Scout,
            numPlayers: 4
        });

        this.initStandardTurnView()

        this.client.start();
        this.client.subscribe(state => this.update(state))

        //Scouting variables
        this.scoutShow = []
        this.scoutedCardIndex = -1
        this.leftRight = 'l'

        //Start Scout Button
        document.getElementById('startScouting').addEventListener('click', () => {
            const activeShowContainer = document.getElementById('activeShowContainer')
            //get number of cards in the activeShowContainer
            const numberOfCards = activeShowContainer.childElementCount
            const highlightedElements = Array.from(container.querySelectorAll('.card.highlight'))
            if (highlightedElements.length != 1) {return}
            const index = highlightedElements[0].dataset.index
            if (index != 0 && index != numberOfCards -1) {return}
            const card = highlightedElements[0].card
            this.scoutShow = this.client.G.playerHands[Number(state.ctx.currentPlayer)].push(card)
            this.scoutedCardIndex = this.scoutShow.length - 1
        })

        //Finish Scout Button
        document.getElementById('finishScouting').addEventListener('click', () => {

            //Clean Up
            this.scoutShow = []
            this.scoutedCardIndex = -1

            this.client.moves.scout()
        })
    }

    renderScoutShow() {
        if (this.scoutShow.length == 0) {
            return
        }
    }

    initStandardTurnView() {
        this.view = new StandardTurnView()

        //showButton
        this.view.showBtn.addEventListener('click', () => {
            let [startIndex, endIndex] = this.view.getHighlightedHandIndices()
            this.client.moves.show(startIndex, endIndex)
        })
    }

    initScout

    update(state) {
        if (this.view.name == "StandardTurnView"){
            const activeShow = state?.G?.activeShow
            if (Array.isArray(activeShow)) {
                renderCards("activeShowContainer", activeShow)
            }
            renderCards("cardContainer", state.G.playerHands[Number(state.ctx.currentPlayer)])
        }
    }

}

const app = new ScoutClient()