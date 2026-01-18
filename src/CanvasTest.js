const ctx = document.getElementById("canvas").getContext("2d");
const CARD_WIDTH = 150
const highlightedCardsIndices = []

function drawPictureWithFixedWidth(path, x, y, scaledWidth) {
    const img = new Image();
    img.src = path
    img.onload = () => {
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight(img, scaledWidth));
    };
}

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

function drawCard(id, x, y) {
    const img = new Image()
    img.src = imagePath(id)
    img.onload = () => {
        const CARD_HEIGHT = scaledHeight(img, CARD_WIDTH)
        ctx.drawImage(img, x, y, CARD_WIDTH, CARD_HEIGHT)
    drawBorder(x, y, CARD_WIDTH, CARD_HEIGHT)
    }
}

function drawCards(ids, x, y) {
    const offset = CARD_WIDTH + 8
    let movingX = x
    for(let id of ids) {
        console.log(id)
        drawCard(id, movingX, y)
        movingX += offset
    }
}

drawCards(["38", "23", "510", "510" , "510", "510"], 80, 500 )