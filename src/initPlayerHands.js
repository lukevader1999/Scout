export const cardIds = [
  "110", "12", "13", "14", "15", "16", "17", "18", "19",
  "210", "23", "24", "25", "26", "27", "28", "29",
  "310", "34", "35", "36", "37", "38", "39",
  "410", "45", "46", "47", "48", "49",
  "510", "56", "57", "58", "59",
  "610", "67", "68", "69",
  "710", "78", "79",
  "810", "89",
  "910"
]

function makeCard(id, rotated){
  return {id, rotated}
}

function makeDeck(numPlayers){
  let result = []
  let skipIDs = []
  if (numPlayers == 2 || numPlayers == 4){
    skipIDs.push("910")
  }
  if (numPlayers == 3){
    skipIDs = skipIDs.concat(["110", "210", "310", "410", "510", "610", "710", "810", "910"])
  }
  for (const id of cardIds){
    if (skipIDs.includes(id)){
      continue
    }
    result.push(makeCard(id, false))
  }
  return result
}

function pickRandomCard(deck){
  const randomIndex = Math.floor(Math.random()*deck.length)
  let card = deck[randomIndex]
  card.rotated = Math.floor(Math.random()*2) == 1 ? true : false
  deck.splice(randomIndex, 1)
  return card
}

export function initPlayerHands(numPlayers){
  let playerHands = []
  for (let i =1; i <= numPlayers; i++){
    playerHands.push([])
  }
  let deck = makeDeck(numPlayers)
  while (deck.length > 0){
    for(const hand of playerHands){
      hand.push(pickRandomCard(deck))
    }
  }
  return playerHands
}