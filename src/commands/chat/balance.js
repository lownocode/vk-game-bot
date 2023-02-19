import { features } from "../../utils/index.js"
import { chatMainKeyboard } from "../../keyboards/index.js"
import { config } from "../../../main.js"

export const balance = {
    access: "chat",
    pattern: /^(balance|баланс)$/i,
    handler: async message => {
        message.send(
            `[id${message.user.vkId}|${message.user.name}], твой баланс: ` +
            `${features.split(message.user.balance)} ${config.bot.currency}\n`, {
            keyboard: chatMainKeyboard(message.chat.mode)
        })
    }
}