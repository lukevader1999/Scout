import { initPlayerHands } from "./initPlayerHands"

export const Scout = {
  setup: ({ctx}) => ({
    playerHands: initPlayerHands(ctx.numPlayers)
  })
}

function getActiveNumber(card){
  if (!rotated){
      return Number(card.id.substring(0,1))
  }
  if (id.length == 2){
    return Number(card.id.substring(1,2))
  }
  return Number(card.id.substring(1,3))
}