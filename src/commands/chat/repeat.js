import { Keyboard } from "vk-io"
import { Op } from "sequelize"

import { ChatRate } from "../../../db/models.js"
import { declOfNum, features } from "../../utils/index.js"
import { config } from "../../../main.js"
import { createGameRate } from "../../functions/index.js"
import { getOrCreateGame } from "../../games/index.js"

export const repeat = {
    command: "repeat",
    pattern: /^$/i,
    handler: async (message, repeats) => {
        const lastGameId = await ChatRate.findOne({
            attributes: ["gameId"],
            order: [
                ["gameId", "DESC"]
            ],
            where: {
                userId: message.user.id,
                gameId: {
                    [Op.ne]: null
                },
                mode: message.chat.mode
            }
        })

        if (!lastGameId) {
            return message.reply("Мы не нашли ваших последних ставок")
        }

        const lastBets = await ChatRate.findAll({
            where: {
                userId: message.user.id,
                gameId: lastGameId.gameId
            }
        })
        const betAmount = lastBets.reduce((a, b) => a + Number(b.betAmount), 0)

        if (["½", "1", "2", "3"].includes(repeats)) {
            if (Number(betAmount) > Number(message.user.balance)) {
                return message.reply("Сумма прошлых ставок больше вашего баланса")
            }

            if (Number(betAmount) < config.bot.minimumBet) {
                return message.reply(
                    `Сумма ставки должна быть как минимум ${features.split(config.bot.minimumBet)} ${config.bot.currency}`
                )
            }

            const multiplierCoins = repeats === "½" ? 0.5 : parseFloat(repeats)

            message.user.balance = Number(message.user.balance) - Math.ceil(Number(betAmount) * multiplierCoins)
            await message.user.save()

            const game = await getOrCreateGame(message.peerId)

            let betsText = ""

            for (const bet of lastBets) {
                switch (message.chat.mode) {
                    case "crash": {
                        betsText += (
                            `✅ ${features.split(Number(bet.betAmount) * multiplierCoins)} ${config.bot.currency} ` +
                            `на x${bet.data.point}\n`
                        )

                        break
                    }
                    case "double": {
                        betsText += (
                            `✅ ${features.split(Number(bet.betAmount) * multiplierCoins)} ${config.bot.currency} ` +
                            `на x${bet.data.multiplier}\n`
                        )

                        break
                    }
                    case "slots": {
                        betsText += (
                            `✅ ${features.split(Number(bet.betAmount) * multiplierCoins)} ${config.bot.currency} ` +
                            `на x${bet.data.multiplier} ${config.games.slotsSmiles[bet.data.smile]}\n`
                        )

                        break
                    }
                    case "dice": {
                        const betType = {
                            even: "чётное",
                            noteven: "нечётное"
                        }[bet.data.bet] || `число ${bet.data.bet}`

                        betsText += (
                            `✅ ${features.split(Number(bet.betAmount) * multiplierCoins)} ${config.bot.currency} ` +
                            `на ${betType}\n`
                        )

                        break
                    }
                    case "cups": {
                        const cupsBetText = {
                            "5": "все полные",
                            "0": "все пустые"
                        }[bet.data.filled] || `${bet.data.filled} ${declOfNum(bet.data.filled, ["полный", "полных", "полных"])}`

                        betsText += (
                            `✅ ${features.split(Number(bet.betAmount) * multiplierCoins)} ${config.bot.currency} ` +
                            `на ${cupsBetText}\n`
                        )

                        break
                    }
                    case "basketball": {
                        const teamWinName = {
                            red: "победу красных",
                            nobody: "ничью",
                            blue: "победу синих"
                        }[bet.data.team]

                        betsText += (
                            `✅ ${features.split(Number(bet.betAmount) * multiplierCoins)} ${config.bot.currency} ` +
                            `на ${teamWinName}\n`
                        )

                        break
                    }
                    case "under7over": {
                        const betName = {
                            under: "меньше 7",
                            over: "больше 7",
                            7: "ровно 7",
                            number: `число ${bet.data.number}`
                        }[bet.data.bet]

                        betsText += (
                            `✅ ${features.split(Number(bet.betAmount) * multiplierCoins)} ${config.bot.currency} ` +
                            `на ${betName}\n`
                        )

                        break
                    }
                    case "wheel": {
                        const betName = {
                            red: "красное",
                            black: "чёрное",
                            even: "чётное",
                            noteven: "нечётное",
                            number: `число ${bet.data.number}`
                        }[bet.data.bet] || `промежуток ${bet.data.bet}`

                        betsText += (
                            `✅ ${features.split(Number(bet.betAmount) * multiplierCoins)} ${config.bot.currency} ` +
                            `на ${betName}\n`
                        )

                        break
                    }
                }

                await createGameRate({
                    game: game,
                    message: message,
                    betAmount: Math.ceil(Number(bet.betAmount) * multiplierCoins),
                    data: bet.data
                })
            }

            return message.reply(betsText || "Ошибка формирования внешнего вида ставок")
        }

        const betsText = lastBets.map(bet => {
            switch (bet.mode) {
                case "crash": {
                    return (
                        `— ${features.split(bet.betAmount)} ${config.bot.currency} на x${bet.data.point}`
                    )
                }
                case "double": {
                    return (
                        `— ${features.split(bet.betAmount)} ${config.bot.currency} на x${bet.data.multiplier}`
                    )
                }
                case "slots": {
                    return (
                        `— ${features.split(bet.betAmount)} ${config.bot.currency} на ` +
                        `x${bet.data.multiplier} ${config.games.slotsSmiles[bet.data.smile]}`
                    )
                }
                case "dice": {
                    const betType = {
                        even: "чётное",
                        noteven: "нечётное"
                    }[bet.data.bet] || `число ${bet.data.bet}`

                    return (
                        `— ${features.split(bet.betAmount)} ${config.bot.currency} на ${betType}`
                    )
                }
                case "cups": {
                    const cupsBetText = {
                        "5": "все полные",
                        "0": "все пустые"
                    }[bet.data.filled] || `${bet.data.filled} ${declOfNum(bet.data.filled, ["полный", "полных", "полных"])}`

                    return (
                        `— ${features.split(bet.betAmount)} ${config.bot.currency} на ${cupsBetText}`
                    )
                }
                case "basketball": {
                    const teamWinName = {
                        red: "победу красных",
                        nobody: "ничью",
                        blue: "победу синих"
                    }[bet.data.team]

                    return (
                        `— ${features.split(bet.betAmount)} ${config.bot.currency} на ${teamWinName}`
                    )
                }
                case "under7over": {
                    const betName = {
                        under: "меньше 7",
                        over: "больше 7",
                        7: "ровно 7",
                        number: `число ${bet.data.number}`
                    }[bet.data.bet]

                    return (
                        `— ${features.split(bet.betAmount)} ${config.bot.currency} на ${betName}`
                    )
                }
                case "wheel": {
                    const betName = {
                        red: "красное",
                        black: "чёрное",
                        even: "чётное",
                        noteven: "нечётное",
                        number: `число ${bet.data.number}`
                    }[bet.data.bet] || `промежуток ${bet.data.bet}`

                    return (
                        `— ${features.split(bet.betAmount)} ${config.bot.currency} на ${betName}`
                    )
                }
            }
        }).join("\n")

        message.send(
            `В прошлой игре вы сделали ${lastBets.length} ${declOfNum(lastBets.length, ["ставку", "ставки", "ставок"])} ` +
            `на общую сумму ${features.split(betAmount)} ${config.bot.currency}:\n\n${betsText}`, {
                keyboard: repeatKeyboard
            }
        )
    }
}

const repeatKeyboard = Keyboard.builder()
    .textButton({
        label: "Повтор x½",
        payload: {
            command: "repeat/½"
        }
    })
    .textButton({
        label: "Повтор x1",
        payload: {
            command: "repeat/1"
        }
    })
    .row()
    .textButton({
        label: "Повтор x2",
        payload: {
            command: "repeat/2"
        }
    })
    .textButton({
        label: "Повтор x3",
        payload: {
            command: "repeat/3"
        }
    })
    .inline()