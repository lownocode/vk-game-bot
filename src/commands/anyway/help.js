import { chatMainKeyboard, privateKeyboard } from "../../keyboards/index.js"

export const help = {
    pattern: /^(помощь|help|меню|начать|start|кнопки|хелп)$/i,
    handler: async message => {
        message.send("Кнопки обновлены!", {
            keyboard: message.isChat ? chatMainKeyboard(message.chat.mode) : privateKeyboard
        })
    }
}