import { vk } from "../../../main.js"
import { Chat } from "../../db/models.js"
import { convertChatMode } from "../../functions/index.js"
import { chatMainKeyboard } from "../../keyboards/index.js"
import { getCurrentGame } from "../../games/index.js"

export const setupModeCallback = {
    callbackCommand: "setMode",
    pattern: /^$/,
    handler: async (message, data) => {
        const mode = data[1]

        const activeGame = await getCurrentGame(message.peerId)

        if (activeGame) {
            return message.send(
                "В этой беседе есть активная игра. Дождитесь итогов, после чего сможете сменить режим"
            )
        }

        const users = await vk.api.messages.getConversationMembers({ peer_id: message.peerId })
        const user = users.items.find((user) => user.member_id === message.userId)

        if (!user.is_owner && !user.is_admin) {
            return vk.api.messages.send({
                message: "Выбрать режим может только создатель или администратор чата",
                peer_id: message.peerId,
                random_id: 0
            })
        }

        await Chat.update({ mode: mode }, { where: { peerId: message.peerId } })

        await vk.api.messages.send({
            message: `Режим беседы успешно изменен на ${convertChatMode(mode, false)}`,
            peer_id: message.peerId,
            random_id: 0,
            keyboard: chatMainKeyboard(mode)
        })
    }
}