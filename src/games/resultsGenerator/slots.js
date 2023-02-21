import { config } from "../../../main.js"
import { features } from "../../utils/index.js"
import { addCoinsToUser } from "../../functions/index.js"

export const slots = async (user, game, rate, results) => {
    const matchedSolutions = game.data.solution.filter(smile => smile === rate.data.smile)

    if (matchedSolutions.length >= rate.data.multiplier) {
        const winCoins = Number(rate.betAmount) * config.games.multipliers.slots[rate.data.multiplier - 1]

        await addCoinsToUser(user, winCoins)

        results.push(
            `✅ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
            `на x${rate.data.multiplier} ${config.games.slotsSmiles[rate.data.smile]} выиграла ` +
            `(+ ${features.split(winCoins)})`
        )
    } else {
        results.push(
            `❌ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
            `на x${rate.data.multiplier} ${config.games.slotsSmiles[rate.data.smile]} проиграла :(`
        )
    }
}