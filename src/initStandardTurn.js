import { drawCards, drawCardsWithHandlers } from "./drawCards"
import { drawShowButton } from "./drawButton"

const X_HAND = 80
const Y_HAND = 700
const X_SHOW_BUTTON = 400
const Y_SHOW_BUTTON = 950

let HAND
let HIGHLIGHTED

export function initStandardTurn(playerHand) {
    HAND = structuredClone(playerHand)
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
    drawShowButton(X_SHOW_BUTTON, Y_SHOW_BUTTON)
}