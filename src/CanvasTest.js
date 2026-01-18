const ctx = document.getElementById("canvas").getContext("2d");
const CARD_WIDTH = 150

function imagePath(id) {
    return "./assets/images/cards/raw/" + id.toString() + ".jpg"
}

function scaledHeight(img, scaledWidth) {
    return img.naturalHeight * scaledWidth / img.naturalWidth
}

function drawBorder(x, y, width, height) {
    const LINE_WIDTH = 5
    ctx.lineWidth = LINE_WIDTH
    ctx.strokeRect(x, y, width, height)
}

function drawCardNormal(id, x, y) {
    const img = new Image()
    img.src = imagePath(id)
    img.onload = () => {
        const CARD_HEIGHT = scaledHeight(img, CARD_WIDTH)
        ctx.drawImage(img, x, y, CARD_WIDTH, CARD_HEIGHT)
    drawBorder(x, y, CARD_WIDTH, CARD_HEIGHT)
    }
}

function degToRad(deg) { return deg * Math.PI / 180; }

function drawCardRotated(id, x, y) {
    const img = new Image()
    img.src = imagePath(id)
    img.onload = () => {
        const CARD_HEIGHT = scaledHeight(img, CARD_WIDTH)

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
    drawBorder(x, y, CARD_WIDTH, CARD_HEIGHT)
    }
}

export function drawCards(cards, x=80, y=500) {
    const offset = CARD_WIDTH + 8
    let movingX = x
    for(let card of cards) {
        if (card.rotated){
            drawCardRotated(card.id, movingX, y)
        } else {
            drawCardNormal(card.id, movingX, y)
        }
        movingX += offset
    }
}