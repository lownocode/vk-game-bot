import { vk } from "../../main.js"
import { chatMainKeyboard, modeKeyboard } from "../../keyboards/index.js"
import { convertChatMode } from "../../functions/index.js"

export const setupMode = {
    access: "chat",
    pattern: /^(установить режим|сменить режим)\s(.*)$/i,
    handler: async message => {
        const mode = message.$match[2]

        const users = await vk.api.messages.getConversationMembers({ peer_id: message.peerId })
        const user = users.items.find((item) => item.member_id === message.senderId)

        if (!user.is_owner && !user.is_admin) return message.send(
            "Выбрать режим может только создатель или администратор чата\n" +
            "Также, у бота обязательно должны быть права администратора чата"
        )

        if (/кубик|слоты|дабл|баскетбол|вил/i.test(mode)) {
            message.chat.mode = convertChatMode(mode)
            await message.chat.save()

            return message.send(`Режим игры в беседе изменён на ${mode}`, {
                keyboard: chatMainKeyboard(convertChatMode(mode))
            })
        }

        message.send("Такого режима не существует. Выберите одну из кнопок", {
            keyboard: modeKeyboard
        })
    }
}