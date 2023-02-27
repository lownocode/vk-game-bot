import {checkChatUserIsAdmin, convertChatMode, readableDate} from "../../functions/index.js"
import { chatInfoKeyboard } from "../../keyboards/index.js"

export const chat = {
    access: "chat",
    pattern: /^(chat|чат|беседа|чят)$/i,
    handler: async message => {
        const checkUser = await checkChatUserIsAdmin(message.peerId, message.senderId)

        if (checkUser.isError) {
            return message.send(
                "Выдайте боту администратора в чате, иначе изменить настройки не получится"
            )
        }

        if (!checkUser.isAdmin) {
            return message.send("Вы не являетесь администратором или плательщиком чата")
        }

        return message.send(
            `Информация о данной беседе:\n\n` +

            `ID беседы: ${message.chat.id}\n` +
            `Режим беседы: ${message.chat.mode ? convertChatMode(message.chat.mode, false).toLowerCase() : "не выбран"}\n` +
            `Время одной игры: ${message.chat.modeGameTime} сек.\n\n` +

            `Оплачена до ${readableDate(Number(message.chat.payedFor))}\n` +
            `Получает ${message.chat.status}% со ставок - @id${message.chat.payer}`, {
                keyboard: chatInfoKeyboard,
                disable_mentions: true
            }
        )
    }
}