import { getCurrentGame } from "../../games/index.js"
import { vk } from "../../../main.js"
import { Chat } from "../../db/models.js"
import { convertChatMode } from "../../functions/index.js"
import { chatMainKeyboard } from "../../keyboards/index.js"

export const chooseChatMode = {
    command: "chooseChatMode",
    pattern: /^$/,
    handler: async (message, mode) => {
        const activeGame = await getCurrentGame(message.peerId)

        if (activeGame) {
            return message.send(
                "В этой беседе есть активная игра. Дождитесь итогов, после чего сможете сменить режим"
            )
        }

        try {
            const { items: users } = await vk.api.messages.getConversationMembers({ peer_id: message.peerId })
            const user = users.find((user) => user.member_id === message.senderId)

            if (!user?.is_owner && !user?.is_admin) {
                return message.send("Выбрать режим может только создатель или администратор чата")
            }

            await Chat.update({ mode: mode }, { where: { peerId: message.peerId } })

            message.send(`Режим беседы успешно изменен на ${convertChatMode(mode, false)}`, {
                keyboard: chatMainKeyboard(mode)
            })
        } catch (e) {
            message.send(
                "Для выбора режима у бота обязательно должны быть права администратора в чате"
            )
        }
    }
}