import { config } from "../../../main.js"
import { features } from "../../utils/index.js"
import { addCoinsToUser } from "../../functions/index.js"

export const dice = async (user, game, rate, results) => {
    const betTypes = {
        even: "чётное",
        noteven: "нечётное"
    }

    if (
        (rate.data.bet === "even" && game.data.number % 2 === 0) ||
        (rate.data.bet === "noteven" && game.data.number % 2 !== 0)
    ) {
        const winCoins = Number(rate.betAmount) * config.games.multipliers.dice.parity

        await addCoinsToUser(user, winCoins)

        return results.push(
            `✅ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
            `на ${betTypes[rate.data.bet]} выиграла (+ ${features.split(winCoins)})`
        )
    }

    if (game.data.number === Number(rate.data.bet)) {
        const winCoins = Number(rate.betAmount) * config.games.multipliers.dice.number

        await addCoinsToUser(user, winCoins)

        return results.push(
            `✅ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
            `на число ${rate.data.bet} выиграла (+ ${features.split(winCoins)})`
        )
    }

    results.push(
        `❌ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
        `на ${/[1-6]/.test(rate.data.bet) ? `число ${rate.data.bet}` : betTypes[rate.data.bet]} проиграла`
    )
}