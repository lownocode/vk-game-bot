import { Keyboard } from "vk-io"
import Sequelize from "sequelize"

import { User, ChatRate } from "../../db/models.js"
import { config } from "../../../main.js"
import { features } from "../../utils/index.js"

export const statistics = {
    command: "chatStatistics",
    pattern: /^$/i,
    handler: async (message, data) => {
        if (!data) {
            const ratesAmount = await ChatRate.sum("betAmount", {
                where: {
                    peerId: message.peerId
                },
            })

            const percentOfBetAmount = await ChatRate.sum("percentOfBetAmount", {
                where: {
                    peerId: message.peerId
                }
            })

            const activeUsers = await ChatRate.count({
                col: "userId",
                where: {
                    peerId: message.peerId
                },
                distinct: true
            })

            const usersInRate = await ChatRate.findAll({
                attributes: ["userId", [Sequelize.fn("SUM", Sequelize.col("betAmount")), "totalBetAmount"]],
                where: {
                    peerId: message.peerId
                },
                group: ["userId"],
                order: [[Sequelize.col("totalBetAmount"), "DESC"]],
                limit: 10
            })

            const users = (await User.findAll({
                attributes: ["id", "vkId", "name"],
                where: {
                    id: usersInRate.map(rate => rate.userId)
                }
            }))

            const text = users.map(user => {
                const totalBetAmount = usersInRate.find(rate => rate.userId === user.dataValues.id).dataValues.totalBetAmount

                return {
                    ...user.dataValues,
                    totalBetAmount: totalBetAmount
                }
            })
                .sort((a, b) => Number(b.totalBetAmount) - Number(a.totalBetAmount))
                .map((user, index) => {
                    return (
                        `${index + 1}) [id${user.vkId}|${user.name}] - ` +
                        `${features.split(user.totalBetAmount)} ${config.bot.currency}`
                    )
                }).join("\n")

            return message.send(
                "📋 Статистика беседы за всё время\n\n" +

                `💷 Поставлено: ${features.split(ratesAmount)} ${config.bot.currency}\n` +
                `👥 Активных игроков: ${features.split(activeUsers)}\n` +
                `💰 Доход беседы: ${features.split(percentOfBetAmount)} ${config.bot.currency}\n\n` +

                `${activeUsers >= 1 ? `👑 Топ поставленных коинов:\n${text}` : ""}`, {
                    // keyboard: ratingsKeyboard,
                    disable_mentions: true
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