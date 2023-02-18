import md5 from "md5"

import { Chat, Game } from "../db/models.js"
import { config } from "../../main.js"
import { features } from "../utils/index.js"

export const createNewGame = async (peerId) => {
    const chat = await Chat.findOne({ where: { peerId: peerId } })

    if (chat.mode === "slots") {
        return await Game.create({
            peerId: peerId,
            endedAt: Date.now() + config.bot.roundTime.slots,
            ...generateGameInfo("slots")
        })
    }
}

const generateGameInfo = (mode) => {
    if (mode === "slots") {
        const randomEmoji = [
            features.random.integer(0, 3),
            features.random.integer(0, 3),
            features.random.integer(0, 3)
        ]
        const secretString = features.random.string(16)
        const salt = `${config.bot.smiles[randomEmoji[0]]}, ${config.bot.smiles[randomEmoji[1]]}, ${config.bot.smiles[randomEmoji[2]]}|${secretString}`

        return {
            salt: salt,
            secretString: secretString,
            data: {
                solution: randomEmoji
            },
            image: config.bot.infoImage[`w${randomEmoji[0] + 1}_${randomEmoji[1] + 1}_${randomEmoji[2] + 1}`],
            hash: md5(salt)
        }
    }
}