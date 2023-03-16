import Sequelize, { Op } from "sequelize"

import { config, vk } from "../../main.js"
import { features } from "../utils/index.js"
import { ChatRate, User } from "../../db/models.js"

export const rewardDailyRating = async () => {
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
            }
        },
        limit: 10
    })

    const users = await User.findAll({
        attributes: ["id", "vkId", "name", "balance"],
        where: {
            id: ratingUsers.map(user => user.userId)
        }
    })

    for (const user of users) {
        if (Number(user.winCoinsToday) < 1) return

        const position = users.indexOf(user)

        await User.update({
                balance: Number(user.balance) + config.dailyRatingRewards[position]
            }, {
                where: {
                    vkId: user.vkId
                }
            })

        await vk.api.messages.send({
            peer_id: user.vkId,
            random_id: 0,
            message:
                "Вы вошли в топ игроков за день и получили бонус в размере " +
                `${features.split(config.dailyRatingRewards[position])} ${config.bot.currency}\n` +
                `Вы заняли ${position + 1} место в топе.`
        })
    }
}