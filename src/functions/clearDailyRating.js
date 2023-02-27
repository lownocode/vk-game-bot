import { config, vk } from "../../main.js"
import { features } from "../utils/index.js"
import { User } from "../../db/models.js"

export const clearDailyRating = async () => {
    const users = await User.findAll({
        attributes: ["vkId", "name", "winCoinsToday", "balance"],
        order: [["winCoinsToday", "DESC"]],
        limit: config.dailyRatingRewards.length,
        where: {
            isAdmin: false
        }
    })

    for (const user of users) {
        if (Number(user.winCoinsToday) < 1) return

        const position = users.indexOf(user)

        await User.update({
                winCoinsToday: 0,
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
                "Вы вошли в топ 10 игроков за день и получили бонус в размере " +
                `${features.split(config.dailyRatingRewards[position])} ${config.bot.currency}\n` +
                `Вы заняли ${position + 1} место в топе.`
        })
    }

    await User.update({ winCoinsToday: 0 }, { where: {} })
}