import { addCoinsToUser } from "../../functions/index.js"
import { features } from "../../utils/index.js"
import { config } from "../../../main.js"

export const double = async (user, game, rate, results) => {
    if (Number(rate.data.multiplier) === game.data.multiplier) {
        const winCoins = Number(rate.betAmount) * Number(rate.data.multiplier)

        await addCoinsToUser(user, winCoins)

        return results.push(
            `✅ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
            `на x${rate.data.multiplier} выиграла (+ ${features.split(winCoins)})`
        )
    }

    results.push(
        `❌ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
        `на x${rate.data.multiplier} проиграла`
    )
}