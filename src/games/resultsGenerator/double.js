import { addCoinsToUser, getRealDoubleMultiply } from "../../functions/index.js"
import { features } from "../../utils/index.js"
import { config } from "../../../main.js"

export const double = async (user, game, rate, results) => {
    const betNames = {
        2: "Black x2",
        3: "Red x3",
        5: "Blue x5",
        50: "Green x50",
    }

    if (Number(rate.data.multiplier) === getRealDoubleMultiply(game.data.number)) {
        const winCoins = Number(rate.betAmount) * Number(rate.data.multiplier)

        await addCoinsToUser(user, winCoins)

        results.push(
            `✅ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
            `на ${betNames[rate.data.multiplier]} выиграла (+ ${features.split(winCoins)})`
        )
    } else {
        results.push(
            `❌ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
            `на ${betNames[rate.data.multiplier]} проиграла :(`
        )
    }
}