import { Chat } from "../db/models.js"
import { config } from "../../main.js"
import {
    chatMainKeyboard,
    chooseChatStatusKeyboard,
    modeKeyboard
} from "../keyboards/index.js"

export const onChatInviteMiddleware = async (event) => {
    if (event.eventMemberId !== -config["vk-group"].id) return

    const chat = await Chat.findOne({ where: { peerId: event.peerId } })

    if (!chat) {
        await Chat.create({
            peerId: event.peerId
        })

        return event.send(
            "👋 Опа, я в чате!\n" +
            "⚠ Для корректной работы боту понадобятся права администратора.\n" +
            "ℹ️ Управлять ботом может любой администратор чата.\n\n" +
            "⚙️ Для управления беседой введите команду «Чат»\n" +
            "Для продолжения выберите статус беседы", {
                keyboard: chooseChatStatusKeyboard
            }
        )
    }

    if (!chat.status) {
        return event.send(
            "👋 И снова привет!\n" +
            "🌟 Статус беседы так и не был выбран, выберите статус.\n\n" +
            "Не забудьте выдать боту права администратора для корректной работы", {
                keyboard: chooseChatStatusKeyboard
            }
        )
    }

    if (!chat.mode) {
        return event.send(
            "👋 И снова привет!\n" +
            "🌟 Режим беседы так и не был выбран, выберите один из режимов.\n\n" +
            "Не забудьте выдать боту права администратора для корректной работы", {
                keyboard: modeKeyboard()
            }
        )
    }

    event.send(
        "👋 И снова привет!\n" +
        "🌟 Режим беседы возобновлён. Не забудьте выдать боту права администратора для корректной работы\n\n" +
        "✨ Удачной игры!", {
            keyboard: chatMainKeyboard(chat.mode)
        }
    )
}