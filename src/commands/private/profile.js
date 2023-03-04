import { features } from "../../utils/index.js"
import { config } from "../../../main.js"
import { readableDate } from "../../functions/index.js"

export const profile = {
    access: "private",
    pattern: /^(профиль|profile)$/i,
    handler: async message => {
        message.send(
            "Ваш профиль:\n\n" +
            `💲 Баланс: ${features.split(message.user.balance)} ${config.bot.currency}\n` +
            `📃 Имя: ${message.user.name}\n` +
            `🤪 Выиграно за сегодня: ${features.split(message.user.winCoinsToday)} ${config.bot.currency}\n` +
            `⏰ Выиграно за всё время: ${features.split(message.user.winCoins)} ${config.bot.currency}\n\n` +
            `®️ Дата регистрации: ${readableDate(message.user.createdAt)}`
        )
    }
}