import { declOfNum, features } from "../../utils/index.js"
import { config } from "../../../main.js"
import { addCoinsToUser } from "../../functions/index.js"

export const cups = async (user, game, rate, results) => {
    const cupsBetText = {
        "5": "все полные",
        "0": "все пустые"
    }[rate.data.filled] || `${rate.data.filled} ${declOfNum(rate.data.filled, ["полный", "полных", "полных"])}`

    if (
        (game.data.filled === 5 && rate.data.filled === 5) &&
        (game.data.filled === 0 && rate.data.filled === 0)
    ) {
        const winCoins = Number(rate.betAmount) * config.games.multipliers.cups[rate.data.filled]

        await addCoinsToUser(user, winCoins)

        return results.push(
            `✅ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
            `на ${cupsBetText} выиграла (+ ${features.split(winCoins)})`
        )
    }

    if (game.data.filled === rate.data.filled) {
        const winCoins = Number(rate.betAmount) * config.games.multipliers.cups[rate.data.filled]

        await addCoinsToUser(user, winCoins)

        return results.push(
            `✅ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
            `на ${cupsBetText} выиграла (+ ${features.split(winCoins)})`
        )
    }

    results.push(
        `❌ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
        `на ${cupsBetText} проиграла`
    )
}