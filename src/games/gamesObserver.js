import { Op } from "sequelize"

import { Game, Rate, User } from "../db/models.js"
import { features, sleep } from "../utils/index.js"
import { config, vk } from "../../main.js"
import { getRealDoubleMultiply } from "../functions/index.js"

export const gamesObserver = async () => {
    const endedGames = await Game.findAll({
        where: {
            endedAt: {
                [Op.lt]: Date.now()
            }
        }
    })

    for (const game of endedGames) {
        const rates = await Rate.findAll({
            where: {
                gameId: game.id
            }
        })

        await gameResults(game, rates)
    }

    await sleep(1_000)
    await gamesObserver()
}

const gameResults = async (game, rates) => {
    const results = []

    for (const rate of rates) {
        const user = await User.findOne({ where: { vkId: rate.userVkId } })

        switch (rate.mode) {
            case "slots": {
                const matchedSolutions = game.data.solution.filter(smile => smile === rate.data.smile)

                if (matchedSolutions.length >= rate.data.multiplier) {
                    const winCoins = Number(rate.betAmount) * config.bot.factors[rate.data.multiplier - 1]

                    await addCoinsToUser(user, winCoins)

                    results.push(
                        `✅ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
                        `на x${rate.data.multiplier} ${config.bot.smiles[rate.data.smile]} выиграла ` +
                        `(+ ${features.split(winCoins)})`
                    )
                } else {
                    results.push(
                        `❌ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
                        `на x${rate.data.multiplier} ${config.bot.smiles[rate.data.smile]} проиграла`
                    )
                }

                await rate.destroy()

                break
            }
            case "cube": {
                const betTypes = {
                    even: "чётное",
                    noteven: "нечётное"
                }

                if (
                    (rate.data.bet === "even" && game.data.number % 2 === 0) ||
                    (rate.data.bet === "noteven" && game.data.number % 2 !== 0)
                ) {
                    const winCoins = Number(rate.betAmount) * 1.8

                    await addCoinsToUser(user, winCoins)

                    results.push(
                        `✅ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
                        `на ${betTypes[rate.data.bet]} выиграла (+ ${features.split(winCoins)})`
                    )
                }

                else if (game.data.number === Number(rate.data.bet)) {
                    const winCoins = Number(rate.betAmount) * 5

                    await addCoinsToUser(user, winCoins)

                    results.push(
                        `✅ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
                        `на число ${rate.data.bet} выиграла (+ ${features.split(winCoins)})`
                    )
                } else {
                    results.push(
                        `❌ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
                        `на ${/[1-6]/.test(rate.data.bet) ? `число ${rate.data.bet}` : betTypes[rate.data.bet]} проиграла`
                    )
                }

                await rate.destroy()

                break
            }
            case "double": {
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
                        `на ${betNames[rate.data.multiplier]} проиграла`
                    )
                }

                await rate.destroy()

                break
            }
            case "basketball": {
                const teamWinName = {
                    red: "победу красных",
                    nobody: "ничью",
                    black: "победу чёрных"
                }[rate.data.team]

                if ((rate.data.team === game.data.winners) && game.data.winners === "nobody") {
                    const winCoins = Number(rate.betAmount) * 14

                    await addCoinsToUser(user, winCoins)

                    results.push(
                        `✅ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
                        `на ${teamWinName} выиграла! (+ ${features.split(winCoins)})`
                    )
                }
                else if (rate.data.team === game.data.winners) {
                    const winCoins = Number(rate.betAmount) * 2

                    await addCoinsToUser(user, winCoins)

                    results.push(
                        `✅ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
                        `на ${teamWinName} выиграла! (+ ${features.split(winCoins)})`
                    )
                } else {
                    results.push(
                        `❌ [id${rate.userVkId}|${rate.username}] ставка ${features.split(rate.betAmount)} ${config.bot.currency} ` +
                        `на ${teamWinName} проиграла`
                    )
                }

                await rate.destroy()
            }
        }
    }

    await game.destroy()
    await vk.api.messages.send({
        random_id: 0,
        message: (
            `Итоги раунда:\n\n` +
            `${results.join("\n")}\n\n` +
            `Хеш игры: ${game.hash}\n` +
            `Проверка честности: ${game.salt}`
        ),
        peer_id: game.peerId,
        [game.image && "attachment"]: game.image
    })
}

const addCoinsToUser = async (user, coins) => {
    const parsedCoins = Math.round(coins)

    user.balance = Number(user.balance) + parsedCoins
    user.winCoins = Number(user.winCoins) + parsedCoins
    user.winCoinsToday = Number(user.winCoinsToday) + parsedCoins

    await user.save()
}