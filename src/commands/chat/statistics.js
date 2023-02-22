import { Keyboard } from "vk-io"
import Sequelize from "sequelize"

import { ChatRate, User } from "../../db/models.js"
import { config } from "../../../main.js"
import { features } from "../../utils/index.js"

export const statistics = {
    command: "chatStatistics",
    pattern: /^$/i,
    handler: async (message, data) => {
        if (!data) {
            const ratesAmount = await ChatRate.sum("amount", {
                where: {
                    peerId: message.peerId
                },
            })

            const activeUsers = await ChatRate.count({
                col: "userId",
                where: {
                    peerId: message.peerId
                },
                distinct: true
            })

            const usersInRating = await ChatRate.findAll({
                attributes: ["userId", [Sequelize.fn("SUM", Sequelize.col("amount")), "totalAmount"]],
                where: {
                    peerId: message.peerId
                },
                group: ["userId"],
                order: [[Sequelize.col("totalAmount"), "DESC"]],
                limit: 5
            })

            const users = (await User.findAll({
                attributes: ["id", "vkId", "name"],
                where: {
                    id: usersInRating.map(rate => rate.userId)
                }
            })).map((user, index) => {
                const amount = usersInRating.find(u => u.userId === user.id).dataValues.totalAmount

                return (
                    `${index + 1}) [id${user.vkId}|${user.name}] - ${features.split(amount)} ${config.bot.currency}`
                )
            })

            return message.send(
                "📋 Статистика беседы за всё время\n\n" +

                `💷 Поставлено: ${features.split(ratesAmount)} ${config.bot.currency}\n` +
                `👥 Активных игроков: ${features.split(activeUsers)}\n` +
                `💰 Доход беседы: ${features.split(message.chat.profitCoins)} ${config.bot.currency}\n\n` +

                `👑 Топ поставленных коинов:\n${users}`, {
                    keyboard: ratingsKeyboard
                }
            )
        }

        if (data === "today") {
            const ratesAmount = await ChatRate.sum("amount", {
                where: {
                    peerId: message.peerId
                },
            })

            const activeUsers = await ChatRate.count({
                col: "userId",
                where: {
                    peerId: message.peerId
                },
                distinct: true
            })

            const usersInRating = await ChatRate.findAll({
                attributes: ["userId", [Sequelize.fn("SUM", Sequelize.col("amount")), "totalAmount"]],
                where: {
                    peerId: message.peerId
                },
                group: ["userId"],
                order: [[Sequelize.col("totalAmount"), "DESC"]],
                limit: 5
            })

            const users = (await User.findAll({
                attributes: ["id", "vkId", "name"],
                where: {
                    id: usersInRating.map(rate => rate.userId)
                }
            })).map((user, index) => {
                const amount = usersInRating.find(u => u.userId === user.id).dataValues.totalAmount

                return (
                    `${index + 1}) [id${user.vkId}|${user.name}] - ${features.split(amount)} ${config.bot.currency}`
                )
            })

            return message.send(
                "📋 Статистика беседы за этот день\n\n" +

                `💷 Поставлено: ${features.split(ratesAmount)} ${config.bot.currency}\n` +
                `👥 Активных игроков: ${features.split(activeUsers)}\n` +
                `💰 Доход беседы: ${features.split(message.chat.profitCoins)} ${config.bot.currency}\n\n` +

                "👑 Топ поставленных коинов:\n" +
                `${users}`, {
                    keyboard: ratingsKeyboard
                }
            )
        }

        if (data === "week") {
            const ratesAmount = await ChatRate.sum("amount", {
                where: {
                    peerId: message.peerId
                },
            })

            const activeUsers = await ChatRate.count({
                col: "userId",
                where: {
                    peerId: message.peerId
                },
                distinct: true
            })

            const usersInRating = await ChatRate.findAll({
                attributes: ["userId", [Sequelize.fn("SUM", Sequelize.col("amount")), "totalAmount"]],
                where: {
                    peerId: message.peerId
                },
                group: ["userId"],
                order: [[Sequelize.col("totalAmount"), "DESC"]],
                limit: 5
            })

            const users = (await User.findAll({
                attributes: ["id", "vkId", "name"],
                where: {
                    id: usersInRating.map(rate => rate.userId)
                }
            })).map((user, index) => {
                const amount = usersInRating.find(u => u.userId === user.id).dataValues.totalAmount

                return (
                    `${index + 1}) [id${user.vkId}|${user.name}] - ${features.split(amount)} ${config.bot.currency}`
                )
            })

            return message.send(
                "📋 Статистика беседы за неделю\n\n" +

                `💷 Поставлено: ${features.split(ratesAmount)} ${config.bot.currency}\n` +
                `👥 Активных игроков: ${features.split(activeUsers)}\n` +
                `💰 Доход беседы: ${features.split(message.chat.profitCoins)} ${config.bot.currency}\n\n` +

                "👑 Топ поставленных коинов:\n" +
                `${users}`, {
                    keyboard: ratingsKeyboard
                }
            )
        }
    }
}

const ratingsKeyboard = Keyboard.builder()
    .textButton({
        label: "За сегодня",
        color: Keyboard.PRIMARY_COLOR,
        payload: {
            command: "chatStatistics/today"
        }
    })
    .textButton({
        label: "За неделю",
        color: Keyboard.PRIMARY_COLOR,
        payload: {
            command: "chatStatistics/week"
        }
    })
    .inline()