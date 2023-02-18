import { chatMainKeyboard, privateKeyboard } from "../../keyboards/index.js"

export const help = {
    pattern: /^(помощь|help|меню|начать)$/i,
    handler: async message => {
        message.send("Кнопки обновлены!", {
            keyboard: message.isChat ? chatMainKeyboard(message.chat.mode) : privateKeyboard(message.user)
        })
    }
}