import { features } from "../../utils/index.js"
import { User } from "../../db/models.js"

export const rating = {
    access: "private",
    pattern: /^(постоянный топ|рейтинг|топ|топ игроков)$/i,
    handler: async message => {
        const users = await User.findAll({
            attributes: ["vkId", "name", "winCoins"],
            order: [["winCoins", "DESC"]],
            limit: 10,
            where: {
                isAdmin: false
            }
        })

        const text =
            "Топ 10 игроков за всё время:\n\n" +
            users.map((user, index) => {
                return `${index + 1}. [id${user.vkId}|${user.name}] выиграл ${features.split(user.winCoins)}`
            }).join("\n")

        message.send(text)
    }
}