import { ChatRate, User } from "../../../db/models.js"
import { config } from "../../../main.js"
import { formatNumToKFormat, getLastMondayDate } from "../../functions/index.js"
import Sequelize, { Op } from "sequelize"

export const rating = {
    pattern: /^(постоянный топ|рейтинг|топ|топ игроков)$/i,
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
                isWin: true,
                userId: {
                    [Op.notIn]: admins.length ? admins.map(user => user.dataValues.id) : [0]
                },
                multiplier: {
                    [Op.ne]: null,
                },
            },
            limit: 10
        })

        const users = await User.findAll({
            attributes: ["id", "vkId", "name"],
            where: {
                id: ratingUsers.map(user => user.userId)
            }
        })

        const text =
            "Топ 10 игроков за всё время:\n\n" +
            ratingUsers.map((user, index) => {
                const userData = users.find(_user => _user.id === user.userId)

                return (
                    `${index + 1}. [id${userData.vkId}|${userData.name}] выиграл ${formatNumToKFormat(Number(user.dataValues.totalWin))} ` +
                    `${config.bot.currency}`
                )
            }).join("\n")

        message.reply(!ratingUsers.length ? "Топ еще не сформирован" : text, {
            disable_mentions: true
        })
    }
}