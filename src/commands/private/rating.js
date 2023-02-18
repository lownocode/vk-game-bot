import { privateKeyboard } from "../../keyboards/index.js"
import { features } from "../../utils/index.js"
import { User } from "../../db/models.js"

export const rating = {
    access: "private",
    pattern: /^(rating|рейтинг|топ|топ игроков)$/i,
    handler: async message => {
        const users = await User.findAll({
            attributes: ["vkId", "name", "winCoins"],
            order: [["winCoins", "DESC"]],
            limit: 10
        })

        const text = "Топ 10 игроков за все время:\n" + users.map((user, index) => {
            return `${index + 1}. [id${user.vkId}|${user.name}] выиграл ${features.split(user.winCoins)}`
        }).join("\n")

        message.send(text, {
            keyboard: privateKeyboard(message.user)
        })
    }
}