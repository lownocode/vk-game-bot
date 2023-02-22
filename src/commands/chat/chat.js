import { convertChatMode, readableDate } from "../../functions/index.js"
import { chatInfoKeyboard } from "../../keyboards/index.js"

export const chat = {
    access: "chat",
    pattern: /^(chat|чат|беседа)$/i,
    handler: async message => {
        return message.send(
            `Информация о данной беседе:\n\n` +
            `ID беседы: ${message.chat.id}\n` +
            `Режим беседы: ${message.chat.mode ? convertChatMode(message.chat.mode, false).toLowerCase() : "не выбран"}\n` +
            `${message.chat.mode ? `Время раунда выбранного режима: ${message.chat.modeRoundTime[message.chat.mode]} сек.` : ""}\n` +
            `Оплачена до ${readableDate(Number(message.chat.payedFor))}\n` +
            `Получает ${message.chat.status}% со ставок - @id${message.chat.payer}`, {
                keyboard: chatInfoKeyboard,
                disabled_mentions: true
            }
        )
    }
}