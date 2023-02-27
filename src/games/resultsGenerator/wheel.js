import { config } from "../../../main.js"
import { features } from "../../utils/index.js"
import { addCoinsToUser } from "../../functions/index.js"

export const wheel = async (user, game, rate, results) => {
    const colorTitle = {
        red: "красное",
        black: "чёрное"
    }

    const evenNotevenTitles = {
        even: "чётное",
        noteven: "нечётное"
    }

    const betText = () => {
        if (["even", "noteven"].includes(rate.data.bet)) return evenNotevenTitles[rate.data.bet]
        if (["red", "black"].includes(rate.data.bet)) return colorTitle[rate.data.bet]
        if (["1-12", "13-24", "25-36", "1-18", "19-36"].includes(rate.data.bet)) return `промежуток ${rate.data.bet}`
    }

    if (rate.data.number >= 0 && game.data.number === rate.data.number) {
        const winCoins = Number(rate.betAmount) * config.games.multipliers.wheel.number

        await addCoinsToUser(user, winCoins)

        results.push(
            `✅ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
            `на число ${rate.data.number} выиграла! (+ ${features.split(winCoins)})`
        )
    }

    else if (
        (rate.data.bet === "even" && game.data.number % 2 === 0) ||
        (rate.data.bet === "noteven" && game.data.number % 2 !== 0) ||
        (rate.data.bet === "1-18" && (game.data.number <= 18 && game.data.number >= 1)) ||
        (rate.data.bet === "19-36" && (game.data.number <= 36 && game.data.number >= 19)) ||
        (rate.data.bet === "red" && config.games.wheelNumbers.red.includes(game.data.number)) ||
        (rate.data.bet === "black" && config.games.wheelNumbers.black.includes(game.data.number))
    ) {
        const winCoins = Number(rate.betAmount) * config.games.multipliers.wheel.parity

        await addCoinsToUser(user, winCoins)

        results.push(
            `✅ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
            `на ${betText()} выиграла! (+ ${features.split(winCoins)})`
        )
    }

    else if (
        (rate.data.bet === "1-12" && (game.data.number <= 12 && game.data.number >= 1)) ||
        (rate.data.bet === "13-24" && (game.data.number <= 24 && game.data.number >= 13)) ||
        (rate.data.bet === "25-36" && (game.data.number <= 36 && game.data.number >= 25))
    ) {
        const winCoins = Number(rate.betAmount) * config.games.multipliers.wheel.interval

        await addCoinsToUser(user, winCoins)

        results.push(
            `✅ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
            `на ${betText()} выиграла! (+ ${features.split(winCoins)})`
        )
    } else {
        results.push(
            `❌ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
            `на ${rate.data.number >= 0 ? `число ${rate.data.number}` : betText()} проиграла`
        )
    }
}