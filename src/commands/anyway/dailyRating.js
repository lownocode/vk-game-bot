import { User } from "../../db/models.js"
import { features } from "../../utils/index.js"
import { config } from "../../../main.js"

export const dailyRating = {
    pattern: /^(дневной топ|топ дня)$/i,
    handler: async message => {
        const users = await User.findAll({
            attributes: ["vkId", "name", "winCoinsToday"],
            order: [["winCoinsToday", "DESC"]],
            limit: 10,
            where: {
                isAdmin: false
            }
        })

        const text =
            "Топ 10 игроков за весь день:\n\n" +
            users.map((user, index) => {
                return (
                    `${index + 1}. [id${user.vkId}|${user.name}] выиграл ${features.split(user.winCoinsToday)} ` +
                    `${config.bot.currency} (Получит: ${features.split(config.dailyRatingRewards[index])} ${config.bot.currency})`
                )
            }).join("\n") +
            "\n\nПризы выдаются каждый день в 0:00 по МСК"

        message.send(text, {
            disable_mentions: true
        })
    }
}