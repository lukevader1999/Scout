import { drawCards, drawCardsWithHandlers } from "./drawCards"

let HAND
let HIGHLIGHTED

export function initStandardTurn(playerHand) {
    HAND = structuredClone(playerHand)
    HIGHLIGHTED = new Array(HAND.length).fill(false)
    let handlers = []
    for (let i = 0; i < HAND.length; i++) {
        let clickHandler = () => {
            HIGHLIGHTED[i] = !HIGHLIGHTED[i]
            drawCards(HAND, HIGHLIGHTED)
        }
        handlers.push(clickHandler)
        HAND[i].HIGHLIGHTED = false
    }
    drawCardsWithHandlers(HAND, handlers)
}