import md5 from "md5"
import crypto from "crypto"

import { Chat, Game } from "../../db/models.js"
import { config } from "../../main.js"
import { features } from "../utils/index.js"
import { getRealDoubleMultiply } from "../functions/index.js"

export const createNewGame = async (peerId) => {
    const chat = await Chat.findOne({ where: { peerId: peerId } })

    return await Game.create({
        peerId: peerId,
        mode: chat.mode,
        endedAt: Date.now() + (chat.modeGameTime * 1000),
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
                hash: md5(salt)
            }
        }
        case "double": {
            const multiplier = getRealDoubleMultiply(features.random.integer(0, 53))
            const salt = `x${multiplier}@${secretString}`

            return {
                salt: salt,
                secretString: secretString,
                data: {
                    multiplier: multiplier
                },
                hash: md5(salt)
            }
        }
        case "basketball": {
            const teamWinners = ["nobody", "red", "blue"][Math.ceil(features.random.integer(0, 199) / 100)]
            const score = features.random.integer(1, 3)
            const salt = `${teamWinners}@${secretString}`

            return {
                salt: salt,
                secretString: secretString,
                data: {
                    winners: teamWinners,
                    score: teamWinners === "nobody" ? 0 : score
                },
                hash: md5(salt)
            }
        }
        case "wheel": {
            const number = features.random.integer(0, 36)
            const salt = `${number}@${secretString}`

            return {
                salt: salt,
                secretString: secretString,
                data: {
                    number: number
                },
                hash: md5(salt)
            }
        }
        case "under7over": {
            const left = features.random.integer(1, 6)
            const right = features.random.integer(1, 6)
            const salt = `${left},${right}@${secretString}`

            return {
                salt: salt,
                secretString: secretString,
                data: {
                    number: left + right,
                    leftDiceSum: left,
                    rightDiceSum: right,
                },
                hash: md5(salt)
            }
        }
        case "cups": {
            const regularCups = features.random.integer(1, 4)
            const rareCupsChance = features.random.integer(0, 30)
            const rareCups = rareCupsChance === 0 ? 0 : rareCupsChance === 30 ? 5 : -1

            const cupsFilled = rareCups === -1 ? regularCups : rareCups

            const salt = `${cupsFilled}@${secretString}`

            return {
                salt: salt,
                secretString: secretString,
                data: {
                    filled: cupsFilled
                },
                hash: md5(salt)
            }
        }
        case "crash": {
            const point = getCrashPoint()
            const salt = `${point}@${secretString}`

            return {
                salt: salt,
                secretString: secretString,
                data: {
                    point: point
                },
                hash: md5(salt)
            }
        }
    }
}

function getCrashPoint() {
    const e = 2 ** 32
    const h = crypto.getRandomValues(new Uint32Array(1))[0]

    if (h % 50 === 0) return 1.00

    return Math.floor((100 * e - h) / (e - h)) / 100
}