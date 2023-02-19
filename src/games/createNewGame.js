import md5 from "md5"

import { Chat, Game } from "../db/models.js"
import { config, vk } from "../../main.js"
import { features } from "../utils/index.js"
import { modeKeyboard } from "../keyboards/index.js"

export const createNewGame = async (peerId) => {
    const chat = await Chat.findOne({ where: { peerId: peerId } })

    switch (chat.mode) {
        case "slots":
        case "cube": {
            return await Game.create({
                peerId: peerId,
                endedAt: Date.now() + config.bot.roundTime[chat.mode],
                ...generateGameInfo(chat.mode)
            })
        }
        default: {
            return await vk.api.messages.send({
                random_id: 0,
                peer_id: peerId,
                message: "К сожалению, режима, кторый привязан к вашей беседе не существует, попробуйте выбрать другой",
                keyboard: modeKeyboard
            })
        }
    }
}

const generateGameInfo = (mode) => {
    const secretString = features.random.string(16)

    switch (mode) {
        case "slots": {
            const randomEmoji = [
                features.random.integer(0, 3),
                features.random.integer(0, 3),
                features.random.integer(0, 3)
            ]
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
        case "cube": {
            const number = features.random.integer(1, 6)
            const salt = `${number}|${secretString}`

            return {
                salt: salt,
                secretString: secretString,
                data: {
                    number: number
                },
                image: config.bot.infoImage[`w` + number],
                hash: md5(salt)
            }
        }
    }
}