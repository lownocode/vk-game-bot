import { features } from "../../utils/index.js"
import { privateKeyboard } from "../../keyboards/index.js"
import { User } from "../../db/models.js"

export const dayRating = {
    access: "private",
    pattern: /^(day rating|дневной рейтинг|топ дня)$/i,
    handler: async message => {
        const users = await User.findAll({
            attributes: ["vkId", "name", "winCoinsToday"],
            order: [["winCoinsToday", "DESC"]],
            limit: 10,
            where: {
                isAdmin: false
            }
        })

        const text = "Топ 10 игроков за весь день:\n" + users.map((user, index) => {
            return `${index + 1}. [id${user.vkId}|${user.name}] выиграл ${features.split(user.winCoinsToday)}`
        }).join("\n")

        message.send(text, {
            keyboard: privateKeyboard(message.user)
        })
    }
}