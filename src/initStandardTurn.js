import { drawCards, drawCardsWithHandlers } from "./drawCards"
import { drawShowButton } from "./drawButton"
import { client } from "./App"

const X_HAND = 80
const Y_HAND = 700
const X_SHOW_BUTTON = 400
const Y_SHOW_BUTTON = 950

let HAND
let HIGHLIGHTED

export function initStandardTurn(client) {
    HAND = structuredClone(client.currentPlayerHand())
    HIGHLIGHTED = new Array(HAND.length).fill(false)
    let handlers = []
    for (let i = 0; i < HAND.length; i++) {
        let clickHandler = () => {
            HIGHLIGHTED[i] = !HIGHLIGHTED[i]
            drawCards(HAND, HIGHLIGHTED, X_HAND, Y_HAND)
        }
        handlers.push(clickHandler)
        HAND[i].HIGHLIGHTED = false
    }
    drawCardsWithHandlers(HAND, handlers)
    drawShowButton(X_SHOW_BUTTON, Y_SHOW_BUTTON, showHandler)
}

function showHandler() {
    let first_highlight_index = -1
    let last_highlight_index = -1

    for (let i = 0; i < HIGHLIGHTED.length; i++) {
        if (HIGHLIGHTED[i]) {
            first_highlight_index = i
            break
        }
    }
    
    for (let i = HIGHLIGHTED.length - 1; i >= 0; i--) {
        if (HIGHLIGHTED[i]) {
            last_highlight_index = i
        }
    }

    if (first_highlight_index==-1 && last_highlight_index==-1) {
        console.log("Cant show if no cards are selected")
        return
    }

    for (let i = first_highlight_index; i <= last_highlight_index; i++) {
        if (!HIGHLIGHTED[i]) {
            console.log("Cant show a selection of non connected cards")
        }
    }

    client.client.moves.show(first_highlight_index, last_highlight_index)
}