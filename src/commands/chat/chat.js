import { convertChatMode } from "../../functions/index.js"

export const chat = {
    access: "chat",
    pattern: /^(chat|чат|беседа)$/i,
    handler: async message => {
        return message.send(
            `Информация о данной беседе:\n\n` +
            `ID беседы: ${message.chat.id}\n` +
            `Режим беседы: ${convertChatMode(message.chat.mode, false)}`
        )
    }
}