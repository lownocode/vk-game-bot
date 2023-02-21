import { config } from "../../../main.js"
import { features } from "../../utils/index.js"
import { addCoinsToUser } from "../../functions/index.js"

export const under7over = async (user, game, rate, results) => {
    const betName = {
        under: "меньше 7",
        over: "больше 7",
        7: "ровно 7",
        number: `число ${rate.data.number}`
    }[rate.data.bet]

    if (rate.data.bet === "number" && rate.data.number === game.data.number) {
        const winCoins = Number(rate.betAmount) * config.games.multipliers.under7over.number

        await addCoinsToUser(user, winCoins)

        results.push(
            `✅ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
            `на ${betName} выиграла (+ ${features.split(winCoins)})`
        )
    }
    else if (
        rate.data.bet === "under" && game.data.number < 7 ||
        rate.data.bet === "over" && game.data.number > 7
    ) {

        const winCoins = Number(rate.betAmount) * config.games.multipliers.under7over.underOver

        await addCoinsToUser(user, winCoins)

        results.push(
            `✅ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
            `на ${betName} выиграла (+ ${features.split(winCoins)})`
        )
    }
    else if (rate.mode.bet === "7" && game.data.number === 7) {
        const winCoins = Number(rate.betAmount) * config.games.multipliers.under7over["7"]

        await addCoinsToUser(user, winCoins)

        results.push(
            `✅ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
            `на ${betName} выиграла (+ ${features.split(winCoins)})`
        )
    } else {
        results.push(
            `❌ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
            `на ${betName} проиграла :(`
        )
    }
}