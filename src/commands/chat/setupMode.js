import { vk } from "../../../main.js"
import { modeKeyboard } from "../../keyboards/index.js"
import { getCurrentGame } from "../../games/index.js"

export const setupMode = {
    access: "chat",
    pattern: /^(установить режим|сменить режим)$/i,
    handler: async message => {
        const activeGame = await getCurrentGame(message.peerId)

        if (activeGame) {
            return message.send(
                "В этой беседе есть активная игра. Дождитесь итогов, после чего сможете сменить режим"
            )
        }

        const users = await vk.api.messages.getConversationMembers({ peer_id: message.peerId })
        const user = users.items.find((item) => item.member_id === message.senderId)

        if (!user.is_owner && !user.is_admin) return message.send(
            "Выбрать режим может только создатель или администратор чата\n" +
            "Также, у бота обязательно должны быть права администратора чата"
        )

        message.send("Выберите одну из кнопок", {
            keyboard: modeKeyboard()
        })
    }
}