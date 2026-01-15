import { initPlayerHands } from "./initPlayerHands"
import { INVALID_MOVE } from 'boardgame.io/core';

export const Scout = {
  setup: ({ctx}) => ({
    playerHands: initPlayerHands(ctx.numPlayers),
    hasScoutAndShow: Array(ctx.numPlayers).fill(true),
    playerPoints: Array(ctx.numPlayers).fill(0),
    activeShow: NaN,
    activeShowPlayer: NaN
  }),

  turn: {
    minMoves: 1,
    maxMoves: 2
  },

  moves: {
    show: ({G, playerID}, startIndex, endIndex) => {
      if (!showIsValid(G, playerID, startIndex, endIndex)){
        return INVALID_MOVE
      }
      let show = G.playerHands[playerID].slice(startIndex, endIndex+1)
      if (!showIsBetter(show, G.activeShow)){
        return INVALID_MOVE
      }
      const points = G.activeShow != null ? G.activeShow.length : 0
      G.playerPoints[playerID] += points
      G.activeShow = show
      G.activeShowPlayer = playerID
      G.playerHands[playerID].splice(startIndex, endIndex - startIndex + 1)
    },

    scout: ({G, playerID}, leftRight, rotated, insertIndex) => {
      let scoutedCardIndex = leftRight == "l" ? 0 : G.activeShow.length-1
      let scoutedCard = G.activeShow[scoutedCardIndex]
      scoutedCard.rotated = rotated
      G.activeShow.splice(scoutedCardIndex, 1)
      G.playerHands[playerID].splice(insertIndex, 0, scoutedCard)

      G.playerPoints[G.activeShowPlayer] += 1
    }
  },

  // Ends the game if this returns anything.
  // The return value is available in `ctx.gameover`.
  endIf: ({ G, ctx }) => {
    if(onePlayerHasNoCardsInHand(G, ctx) != null) {
      return onePlayerHasNoCardsInHand(G, ctx)
    }

    if(nextPlayerPossesActiveShow(G, ctx) != null) {
      return G.activeShowPlayer
    }
  },
}

function nextPlayerPossesActiveShow(G, ctx){
  if ((ctx.activePlayer + 1)%ctx.numPlayers == G.activeShowPlayer){
    return true
  }
}

function onePlayerHasNoCardsInHand(G, ctx){
  for (let i=0; i<ctx.numPlayers; i++) {
    if (G.playerHands[i].length) {
      return i
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
    if ((secondValue - firstValue) !== diff){
      return false
    }
  }
  return true
}

function showIsBetter(newShow, oldShow){
  //Überprüfung unterschiedlicher Längen
  if (!Array.isArray(oldShow)) {
    return true
  }
  if (newShow.length > oldShow.length) {
    return true
  }
  if (newShow.length < oldShow.length) {
    return false
  }

  //Umwandeln von Card-Objects in Nummern
  let numbersNew = newShow.map(card => getActiveNumber(card))
  let numbersOld = oldShow.map(card => getActiveNumber(card))
  
  //Spezialfall Länge 1
  if (newShow.length == 1){
    if (numbersNew[0] > numbersOld[0]) {
      return true
    }
    return false
  }

  //Überprüfen unterschiedlicher Showarten
  const diffNew = numbersNew[1] - numbersNew[0]
  const diffOld = numbersOld[1] - numbersOld[0]

  if (diffNew == 0 && diffOld != 0) {
    return true
  }
  if (diffNew != 0 && diffOld == 0) {
    return false
  }

  //Hier: Gleiche Länge und gleiche Showart
  const maxNew = Math.max(...numbersNew)
  const maxOld = Math.max(...numbersOld)

  if (maxNew > maxOld) {
    return true
  }

  return false
}