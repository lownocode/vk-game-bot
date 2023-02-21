import { config } from "../../../main.js"
import { features } from "../../utils/index.js"
import { addCoinsToUser } from "../../functions/index.js"

export const basketball = async (user, game, rate, results) => {
    const teamWinName = {
        red: "победу красных",
        nobody: "ничью",
        black: "победу чёрных"
    }[rate.data.team]

    if ((rate.data.team === game.data.winners) && game.data.winners === "nobody") {
        const winCoins = Number(rate.betAmount) * config.games.multipliers.basketball.nobody

        await addCoinsToUser(user, winCoins)

        results.push(
            `✅ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
            `на ${teamWinName} выиграла! (+ ${features.split(winCoins)})`
        )
    }
    else if (rate.data.team === game.data.winners) {
        const winCoins = Number(rate.betAmount) * config.games.multipliers.basketball.red // or balck

        await addCoinsToUser(user, winCoins)

        results.push(
            `✅ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
            `на ${teamWinName} выиграла! (+ ${features.split(winCoins)})`
        )
    } else {
        results.push(
            `❌ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
            `на ${teamWinName} проиграла :(`
        )
    }
}