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
      let hand = G.playerHands[playerID]
      let show = hand.slice(startIndex, endIndex+1)
      G.activeShow = show
      G.playerHands[playerID].splice(startIndex, endIndex - startIndex + 1)
    }
  }
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

function showIsValid(G, playerID, startIndex, endIndex){
  //TO-DO: Implement real logic
  return true
}