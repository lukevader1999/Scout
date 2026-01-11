import { initPlayerHands } from "./initPlayerHands"
import { INVALID_MOVE } from 'boardgame.io/core';

export const Scout = {
  setup: ({ctx}) => ({
    playerHands: initPlayerHands(ctx.numPlayers),
    hasScoutAndShow: Array(ctx.numPlayers).fill(true),
    activeShow: NaN
  }),

  turn: {
    minMoves: 1,
    maxMoves: 1
  },

  moves: {
    show: ({G, playerID}, startIndex, endIndex) => {
      if (!showIsValid(G, playerID, startIndex, endIndex)){
        return INVALID_MOVE
      }
      let show = G.playerHands[playerID].slice(startIndex, endIndex+1)
      G.activeShow = show
      G.playerHands[playerID].splice(startIndex, endIndex - startIndex + 1)
    }
  }
}

function getActiveNumber(card){
  if (!card.rotated){
      return Number(card.id.substring(0,1))
  }
  if (card.id.length == 2){
    return Number(card.id.substring(1,2))
  }
  return Number(card.id.substring(1,3))
}

function showIsValid(G, playerID, startIndex, endIndex){
  let show = G.playerHands[playerID].slice(startIndex, endIndex+1).map(card => getActiveNumber(card))
  if (show.length == 1){
    return true
  }
  const diff = show[1] - show[0]
  if (![-1, 0, 1].includes(diff)){
    return false
  }
  for (let i=1; i<show.length; i++){
    const firstValue = show[i-1]
    const secondValue = show[i]
    if (!(secondValue - firstValue) == diff){
      return false
    }
  }
  return true
}