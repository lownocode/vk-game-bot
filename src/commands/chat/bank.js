import { getCurrentGame } from "../../games/index.js"
import { Rate } from "../../db/models.js"
import { features } from "../../utils/index.js"
import { config } from "../../../main.js"

export const bank = {
    access: "chat",
    pattern: /^(bank|банк)$/i,
    handler: async message => {
        const currentGame = await getCurrentGame(message.chat.peerId)

        if (!currentGame) {
            return message.send(
                "На данный момент банк пуст, самое время сделать первую ставку!"
            )
        }

        const timeToEndRound = Math.floor((currentGame.endedAt - Date.now()) / 1000)

        if (timeToEndRound <= 0) {
            return message.send("Генерация результатов, ожидайте...")
        }

        const rates = await Rate.findAll({ where: { gameId: currentGame.id } })
        const sortedRates = await getGameRates(rates, message.chat.mode)
        const totalBetsAmount = rates.reduce((acc, cur) => acc + Number(cur.betAmount), 0)

        return message.send(
            `Ставки на текущую игру:\n\n` +
            `${sortedRates.join("\n")}\n\n` +
            `Общая сумма ставок: ${features.split(totalBetsAmount)}\n` +
            `До конца раунда: ${timeToEndRound} сек.\n` +
            `Хеш игры: ${currentGame.hash}`
        )
    }
}

const getGameRates = async (rates, mode) => {
    switch (mode) {
        case "slots": {
            return rates.map((rate) => {
                return (
                    `[id${rate.userVkId}|${rate.username}] - ${features.split(rate.betAmount)} ${config.bot.currency} ` +
                    `на x${rate.data.multiplier} ${config.games.slotsSmiles[rate.data.smile]}`
                )
            })
        }
        case "cube": {
            const betTypes = {
                even: "чётное",
                noteven: "нечётное"
            }

            return rates.map((rate) => {
                return (
                    `[id${rate.userVkId}|${rate.username}] - ${features.split(rate.betAmount)} ${config.bot.currency} ` +
                    `на ${/[1-6]/.test(rate.data.bet) ? `число ${rate.data.bet}` : betTypes[rate.data.bet]}`
                )
            })
        }
        case "double": {
            const betNames = {
                2: "Black x2",
                3: "Red x3",
                5: "Blue x5",
                50: "Green x50",
            }

            return rates.map((rate) => {
                return (
                    `[id${rate.userVkId}|${rate.username}] - ${features.split(rate.betAmount)} ${config.bot.currency} ` +
                    `на ${betNames[rate.data.multiplier]}`
                )
            })
        }
        case "basketball": {
            const teamWinName = {
                red: "победу красных",
                nobody: "ничью",
                black: "победу чёрных"
            }

            return rates.map((rate) => {
                return (
                    `[id${rate.userVkId}|${rate.username}] - ${features.split(rate.betAmount)} ${config.bot.currency} ` +
                    `на ${teamWinName[rate.data.team]}`
                )
            })
        }
    }
}