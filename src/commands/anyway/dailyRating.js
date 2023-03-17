import { ChatRate, User } from "../../../db/models.js"
import { config } from "../../../main.js"
import { formatNumToKFormat } from "../../functions/index.js"
import Sequelize, { Op } from "sequelize"

export const dailyRating = {
    pattern: /^(дневной топ|топ дня)$/i,
    handler: async message => {
        const admins = await User.findAll({ attributes: ["id"], where: { isAdmin: true } })
        const ratingUsers = await ChatRate.findAll({
            attributes: [
                "userId",
                [Sequelize.literal(`SUM("betAmount" * multiplier)`), "totalWin"],
            ],
            group: ["userId"],
            order: [
                ["totalWin", "DESC"]
            ],
            where: {
                updatedAt: {
                    [Op.gt]: new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        new Date().getDate()
                    )
                },
                isWin: true,
                userId: {
                    [Op.notIn]: admins.length ? admins.map(user => user.dataValues.id) : [0]
                }
            },
            limit: config.dailyRatingRewards.length,
        })

        const users = await User.findAll({
            attributes: ["id", "vkId", "name"],
            where: {
                id: ratingUsers.map(user => user.userId),
                isAdmin: false
            }
        })

        const text =
            `Топ ${config.dailyRatingRewards.length} игроков за весь день:\n\n` +
            ratingUsers.map((user, index) => {
                const userData = users.find(_user => _user.id === user.userId)

                return (
                    `${index + 1}. [id${userData.vkId}|${userData.name}] выиграл ${formatNumToKFormat(Number(user.dataValues.totalWin))} ` +
                    `${config.bot.currency} ${config.dailyRatingRewards[index] 
                        ? `(Получит: ${formatNumToKFormat(config.dailyRatingRewards[index])} ${config.bot.currency})` 
                        : ""}`
                )
            }).join("\n") +
            "\n\nПризы выдаются каждый день в 0:00 по МСК"

        message.reply(!ratingUsers.length ? "Топ еще не сформирован" : text, {
            disable_mentions: true
        })
    }
}