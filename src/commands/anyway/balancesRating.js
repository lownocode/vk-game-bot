import { User } from "../../../db/models.js"
import { features } from "../../utils/index.js"
import { config } from "../../../main.js"

export const balancesRating = {
    pattern: /^(топ балансов|топ балов)$/i,
    handler: async message => {
        const users = await User.findAll({
            attributes: ["vkId", "name", "winCoinsToday", "balance"],
            order: [["balance", "DESC"]],
            limit: 10,
            where: {
                isAdmin: false
            }
        })

        const text =
            "Топ 10 игроков с самыми большими балансами:\n\n" +
            users.map((user, index) => {
                return (
                    `${index + 1}. [id${user.vkId}|${user.name}] баланс: ${features.split(user.balance)} ` +
                    `${config.bot.currency}`
                )
            }).join("\n")

        message.send(text, {
            disable_mentions: true
        })
    }
}