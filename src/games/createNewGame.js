import md5 from "md5"
import crypto from "crypto"

import { Chat, Game } from "../db/models.js"
import { config } from "../../main.js"
import { features } from "../utils/index.js"
import { getRealDoubleMultiply } from "../functions/index.js"

export const createNewGame = async (peerId) => {
    const chat = await Chat.findOne({ where: { peerId: peerId } })

    return await Game.create({
        peerId: peerId,
        mode: chat.mode,
        endedAt: Date.now() + (chat.modeRoundTime[chat.mode] * 1000),
        ...generateGameInfo(chat.mode)
    })
}

const generateGameInfo = (mode) => {
    const secretString = crypto.randomBytes(12).toString("hex")

    switch (mode) {
        case "slots": {
            const randomEmoji = [
                features.random.integer(0, 3),
                features.random.integer(0, 3),
                features.random.integer(0, 3)
            ]
            const salt =
                `${config.games.slotsSmiles[randomEmoji[0]]}` +
                `${config.games.slotsSmiles[randomEmoji[1]]}` +
                `${config.games.slotsSmiles[randomEmoji[2]]}@${secretString}`

            return {
                salt: salt,
                secretString: secretString,
                data: {
                    solution: randomEmoji
                },
                image: config.games.slotsImages[`${randomEmoji[0] + 1}_${randomEmoji[1] + 1}_${randomEmoji[2] + 1}`],
                hash: md5(salt)
            }
        }
        case "dice": {
            const number = features.random.integer(1, 6)
            const salt = `${number}@${secretString}`

            return {
                salt: salt,
                secretString: secretString,
                data: {
                    number: number
                },
                image: config.games.cubeImages[number],
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
            const salt = `${number}@${betNames[getRealDoubleMultiply(number)]}@${secretString}`

            return {
                salt: salt,
                secretString: secretString,
                data: {
                    number: number
                },
                image: config.games.doubleImages[number],
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
            const salt = `${teamNames[teamWinners]}@${secretString}`

            return {
                salt: salt,
                secretString: secretString,
                data: {
                    winners: teamWinners
                },
                image: config.games.basketballImages[teamWinners],
                hash: md5(salt)
            }
        }
        case "wheel": {
            const number = Math.ceil(features.random.integer(0, 35_999) / 1000)
            const salt = `${number}@${secretString}`

            return {
                salt: salt,
                secretString: secretString,
                data: {
                    number: number
                },
                image: null,
                hash: md5(salt)
            }
        }
        case "under7over": {
            const number = features.random.integer(2, 12)
            const salt = `${number}@${secretString}`

            return {
                salt: salt,
                secretString: secretString,
                data: {
                    number: number
                },
                image: config.games.under7overImages[number],
                hash: md5(salt)
            }
        }
    }
}