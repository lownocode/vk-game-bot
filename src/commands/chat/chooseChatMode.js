import { getCurrentGame } from "../../games/index.js"
import { Chat } from "../../db/models.js"
import { checkChatUserIsAdmin, convertChatMode } from "../../functions/index.js"
import { chatMainKeyboard } from "../../keyboards/index.js"

export const chooseChatMode = {
    command: "chooseChatMode",
    pattern: /^$/,
    handler: async (message, mode) => {
        const activeGame = await getCurrentGame(message.peerId)
        const checkUser = await checkChatUserIsAdmin(message.peerId, message.senderId)

        if (activeGame) {
            return message.send(
                "В этой беседе есть активная игра. Дождитесь итогов, после чего сможете сменить режим"
            )
        }

        if (checkUser.isError) {
            return message.send(
                "Выдайте боту администратора в чате, иначе изменить режим не получится"
            )
        }

        if (!checkUser.isAdmin) {
            return message.send("Вы не являетесь администратором или плательщиком чата")
        }

        await Chat.update({ mode: mode }, { where: { peerId: message.peerId } })

        message.send(`Режим беседы успешно изменен на ${convertChatMode(mode, false).toLowerCase()}`, {
            keyboard: chatMainKeyboard(mode)
        })
    }
}