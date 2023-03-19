import { features } from "../../utils/index.js"
import { config } from "../../../main.js"
import { addCoinsToUser } from "../../functions/index.js"

export const crash = async (user, game, rate, results) => {
    if (game.data.point >= rate.data.point) {
        const winCoins = Number(rate.betAmount) * rate.data.point

        await addCoinsToUser(user, winCoins)

        return results.push(
            `✅ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
            `на x${rate.data.point} выиграла (+ ${features.split(winCoins)})`
        )
    }

    results.push(
        `❌ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
        `на x${rate.data.point} проиграла`
    )
}