import md5 from "md5"

import { Chat, Game } from "../db/models.js"
import { config } from "../../main.js"
import { features } from "../utils/index.js"
import { getRealDoubleMultiply } from "../functions/index.js"

export const createNewGame = async (peerId) => {
    const chat = await Chat.findOne({ where: { peerId: peerId } })

    switch (chat.mode) {
        case "slots"      :
        case "cube"       :
        case "double"     :
        case "basketball" : {
            return await Game.create({
                peerId: peerId,
                endedAt: Date.now() + config.bot.roundTime[chat.mode],
                ...generateGameInfo(chat.mode)
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
        case "double": {
            const betNames = {
                2: "Black x2",
                3: "Red x3",
                5: "Blue x5",
                50: "Green x50",
            }
            const number = features.random.integer(0, 53)
            const salt = `${number}|${betNames[getRealDoubleMultiply(number)]}|${secretString}`

            return {
                salt: salt,
                secretString: secretString,
                data: {
                    number: number
                },
                image: config.bot.images[number],
                hash: md5(salt)
            }
        }
        case "basketball": {
            const teamNames = {
                red: "Красные",
                nobody: "Ничья",
                black: "Чёрные"
            }
            const teamWinners = ["red", "nobody", "black"][Math.ceil(features.random.integer(0, 199) / 100)]
            const salt = `${teamNames[teamWinners]}|${secretString}`

            return {
                salt: salt,
                secretString: secretString,
                data: {
                    winners: teamWinners
                },
                image: config.bot.infoImage["basketball_" + teamWinners],
                hash: md5(salt)
            }
        }
    }
}