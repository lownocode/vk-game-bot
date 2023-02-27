import { chatMainKeyboard, modeKeyboard, privateKeyboard } from "../../keyboards/index.js"

export const help = {
    pattern: /^(помощь|help|меню|начать|start|кнопки|хелп)$/i,
    handler: async message => {
        if (message.isChat && !message.chat.mode) {
            return message.send("Режим беседы не был установлен, выберите один из режимов", {
                keyboard: modeKeyboard()
            })
        }

        message.send("Кнопки обновлены!", {
            keyboard: message.isChat ? chatMainKeyboard(message.chat.mode) : privateKeyboard
        })
    }
}