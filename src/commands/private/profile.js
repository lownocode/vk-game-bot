import Sequelize, { Op } from "sequelize"

import { declOfNum, features } from "../../utils/index.js"
import { config } from "../../../main.js"
import { convertChatMode, formatNumToKFormat, readableDate } from "../../functions/index.js"
import { ChatRate } from "../../../db/models.js"

export const profile = {
    access: "private",
    pattern: /^(профиль|profile)$/i,
    handler: async message => {
        const dailyWin = (await ChatRate.findOne({
            attributes: [
                [Sequelize.literal(`SUM("betAmount")`), "amount"],
                [Sequelize.literal(`COUNT("betAmount")`), "count"],
            ],
            where: {
                userId: message.user.id,
                isWin: true,
                updatedAt: {
                    [Op.gt]: new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        new Date().getDate()
                    )
                }
            }
        })).dataValues

        const totalWin = (await ChatRate.findOne({
            attributes: [
                [Sequelize.literal(`SUM("betAmount")`), "amount"],
                [Sequelize.literal(`COUNT("betAmount")`), "count"],
            ],
            where: {
                userId: message.user.id,
                isWin: true
            }
        })).dataValues

        const totalLoseBetsCount = await ChatRate.count("betAmount", {
            where: {
                userId: message.user.id,
                isWin: false,
            }
        })

        const totalBetCoins = await ChatRate.sum("betAmount", {
            where: {
                userId: message.user.id,
            }
        })

        const biggestMultiplier = await ChatRate.findOne({
            attributes: [
                "mode",
                [Sequelize.literal(`MAX(multiplier)`), "multiplier"]
            ],
            group: ["mode"],
            where: {
                userId: message.user.id,
            }
        })

        const lovestMode = (await ChatRate.findAll({
            attributes: ['mode', [Sequelize.fn('COUNT', Sequelize.col('mode')), 'count']],
            group: ['mode'],
            order: [[Sequelize.literal('count'), 'DESC']],
            limit: 1,
            where: {
                userId: message.user.id
            }
        }))[0].dataValues

        message.send(
            "Ваш профиль:\n\n" +
            `💲 Баланс: ${features.split(message.user.balance)} ${config.bot.currency}\n` +
            `📃 Имя: ${message.user.name}\n` +

            `🤪 Выиграно за сегодня: ${formatNumToKFormat(Number(dailyWin.amount))} ${config.bot.currency} ` +
            `(${features.split(Number(dailyWin.count))} ${declOfNum(Number(dailyWin.count), ["ставка", "ставки", "ставок"])})\n` +

            `👀 Выиграно за всё время: ${formatNumToKFormat(Number(totalWin.amount))} ${config.bot.currency} ` +
            `(${features.split(Number(totalWin.count))} ${declOfNum(Number(totalWin.count), ["ставка", "ставки", "ставок"])})\n` +

            `🤑 Всего наиграно: ${formatNumToKFormat(Number(totalBetCoins))} ${config.bot.currency}\n` +
            `❌ Всего проигрышей: ${features.split(Number(totalLoseBetsCount))}\n` +
            (biggestMultiplier ? `💹 Наибольший множитель: x${biggestMultiplier.multiplier} (${convertChatMode(biggestMultiplier.mode, false)})\n` : "") +
            (lovestMode ? `💗 Любимый режим: ${convertChatMode(lovestMode.mode, false)} (${features.split(Number(lovestMode.count))} ${declOfNum(Number(lovestMode.count), ["ставка", "ставки", "ставок"])})\n\n` : "") +

            `⏰️ Дата регистрации: ${readableDate(message.user.createdAt)}`
        )
    }
}