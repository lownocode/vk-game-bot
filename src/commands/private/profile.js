import { profileKeyboard } from "../../keyboards/index.js"
import { features } from "../../utils/index.js"
import { config } from "../../main.js"

export const profile = {
    access: "private",
    pattern: /^(профиль|profile)$/i,
    handler: async message => {
        message.send(
            "Ваш профиль:\n\n" +
            `💲 Баланс: ${features.split(message.user.balance)} ${config.bot.currency}\n` +
            `💰 Бонусный баланс: ${features.split(message.user.bonusBalance)} ${config.bot.currency}\n\n` +
            `📃 Имя: ${message.user.name}\n` +
            `🤪 Выиграно за сегодня: ${features.split(message.user.winCoinsToday)} ${config.bot.currency}\n` +
            `⏰ Выиграно за всё время: ${features.split(message.user.winCoins)} ${config.bot.currency}\n\n` +
            `⛔ Бан: ${message.user.isBanned ? "да" : "нет"}\n` +
            `®️ Дата регистрации: ${message.user.createdAt}`,
            {
                keyboard: profileKeyboard
            }
        )
    }
}