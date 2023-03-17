import Sequelize, { Op } from "sequelize"

import { ChatRate, User } from "../../../db/models.js"
import { config } from "../../../main.js"
import { formatNumToKFormat, getLastMondayDate } from "../../functions/index.js"

export const weeklyRating = {
    pattern: /^(топ недели|рейтинг недели|недельный топ)$/i,
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
                    [Op.gt]: getLastMondayDate()
                },
                isWin: true,
                userId: {
                    [Op.notIn]: admins.length ? admins.map(user => user.dataValues.id) : [0]
                }
            },
            limit: config.weeklyRatingRewards.length,
        })

        const users = await User.findAll({
            attributes: ["id", "vkId", "name"],
            where: {
                id: ratingUsers.map(user => user.userId),
                isAdmin: false
            }
        })

        const text =
            "Топ 10 игроков недели:\n\n" +
            ratingUsers.map((user, index) => {
                const userData = users.find(_user => _user.id === user.userId)

                return (
                    `${index + 1}. [id${userData.vkId}|${userData.name}] выиграл ${formatNumToKFormat(Number(user.dataValues.totalWin))} ` +
                    `${config.bot.currency} ${config.weeklyRatingRewards[index]
                        ? `(Получит: ${formatNumToKFormat(config.weeklyRatingRewards[index])} ${config.bot.currency})`
                        : ""}`
                )
            }).join("\n") +
            "\n\nПризы выдаются каждый понедельник в 0:00 по МСК"

        message.reply(!ratingUsers.length ? "Топ еще не сформирован" : text, {
            disable_mentions: true
        })
    }
}