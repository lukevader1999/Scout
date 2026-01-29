import { onClick } from "./onClick";
import { loadImageMap } from "./loadImageMap";

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d");
const imageMap = await loadImageMap()

const X_HAND_AREA = 80
const Y_HAND_AREA = 700

export const CARD_WIDTH = 150
export const CARD_HEIGHT = scaledHeight(imageMap.get("12"), CARD_WIDTH)

function scaledHeight(img, scaledWidth) {
    return img.naturalHeight * scaledWidth / img.naturalWidth
}

function clearHandArea() {
    ctx.clearRect(X_HAND_AREA-5, Y_HAND_AREA-5, canvas.width, CARD_HEIGHT+10)
}

function drawNormalBorder(x, y, width, height) {
    ctx.lineWidth = 4
    ctx.strokeStyle = 'rgba(0,0,0,1)'
    ctx.strokeRect(x, y, width, height)
}

function drawHighlightBorder(x, y, widht, height) {
    ctx.lineWidth = 8
    ctx.strokeStyle = 'rgba(200, 200, 0, 1)'
    ctx.strokeRect(x, y, widht, height)
}

function drawCardNormal(id, x, y, highlighted=false) {
    const img = imageMap.get(id)
    ctx.drawImage(img, x, y, CARD_WIDTH, CARD_HEIGHT)
    if (highlighted) {
        drawHighlightBorder(x, y, CARD_WIDTH, CARD_HEIGHT)
    } else {
        drawNormalBorder(x, y, CARD_WIDTH, CARD_HEIGHT)
    }
}

function degToRad(deg) { return deg * Math.PI / 180; }

function drawCardRotated(id, x, y, highlighted=false) {
    const img = imageMap.get(id)
    //Annoying transformation + rotation you have to do to render an image rotated 
    ctx.save()
    //Mittelpunktskoordinaten des Bildes bestimmen
    const cx = x + CARD_WIDTH/2
    const cy = y + CARD_HEIGHT/2
    ctx.translate(cx, cy)
    ctx.rotate(degToRad(180)) 
    ctx.translate(-cx, -cy)
    ctx.drawImage(img, x, y, CARD_WIDTH, CARD_HEIGHT)
    ctx.restore()
    if (highlighted) {
        drawHighlightBorder(x, y, CARD_WIDTH, CARD_HEIGHT)
    } else {
        drawNormalBorder(x, y, CARD_WIDTH, CARD_HEIGHT)
    }
}

export function drawCards(cards, highlightedIndices = [], x=X_HAND_AREA, y=Y_HAND_AREA) {
    clearHandArea()
    const offset = CARD_WIDTH + 8
    let movingX = x
    for(let i = 0; i< cards.length; i++) {
        let card = cards[i]

        let highlighted = false
        try {
            highlighted = highlightedIndices[i]
        } catch{}

        if (card.rotated){
            drawCardRotated(card.id, movingX, y, highlighted)
        } else {
            drawCardNormal(card.id, movingX, y, highlighted)
        }
        movingX += offset
    }
}

export function drawCardsWithHandlers(cards, handlers, x=X_HAND_AREA, y=Y_HAND_AREA) {
    clearHandArea()
    const offset = CARD_WIDTH + 8
    let movingX = x
    for(let i = 0; i< cards.length; i++) {
        let card = cards[i]
        let handler = handlers[i]

        if (card.rotated){
            drawCardRotated(card.id, movingX, y)
        } else {
            drawCardNormal(card.id, movingX, y)
        }

        onClick(movingX, y, CARD_WIDTH, CARD_HEIGHT, handler)

        movingX += offset
    }
}