import { Game } from "../../db/models.js"

export const getCurrentGame = async (peerId) => {
    return await Game.findOne({ where: { peerId: peerId } })
}