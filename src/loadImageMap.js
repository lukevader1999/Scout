import { cardIds } from "./initPlayerHands";

function imagePath(id) {
    return "./assets/images/cards/raw/" + id.toString() + ".jpg"
}

function loadImage(path)  {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = path
        img.onload = () => resolve(img)
    })
}

let cachedImageMap = null

export async function loadImageMap() {
    if (cachedImageMap) {return cachedImageMap}

    const promises = cardIds.map(id => loadImage(imagePath(id)).then(img => ({ id, img}) ))
    const results = await Promise.all(promises)
    let map = new Map()
    for (const r of results){
        map.set(String(r.id), r.img)
    }

    cachedImageMap = map
    return map
}