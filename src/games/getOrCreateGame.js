import { getCurrentGame } from "./getCurrentGame.js"
import { createNewGame } from "./createNewGame.js"

export const getOrCreateGame = async (peerId) => {
    const currentGame = await getCurrentGame(peerId)

    if (!currentGame) {
        const newGame = await createNewGame(peerId)

        return {
            ...newGame.dataValues,
            isNewGame: true
        }
    }

    return currentGame
}