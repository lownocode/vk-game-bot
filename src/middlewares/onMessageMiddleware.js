import { commandsList, vk } from "../../main.js"
import { privateKeyboard } from "../keyboards/index.js"
import { executeCommand } from "../functions/index.js"
import { Chat, User } from "../db/models.js"

export const onMessageMiddleware = async (message, next) => {
    if (message.isGroup || !message.text || message.senderType !== "user") return

    message.text = message.text.replace(/^\[club(\d+)\|(.*)\]/i, '').trim()

    if (
        commandsList.find(cmd => cmd.pattern.test(message.text)) ||
        message.messagePayload?.command
    ) {
        if (message.isChat) {
            const chat = await Chat.findOne({ where: { peerId: message.peerId } })

            if (!chat) {
                return message.send(
                    "⚠ Ошибка! Ваша беседа не зарегистрирована.\n" +
                    "🌟 Решить эту проблему можно путём добавления бота в беседу повторно."
                )
            }

            message.chat = chat
        }
        message.user = await getUser(message)
    }

    if (message.messagePayload?.command) {
        const command = message.messagePayload?.command?.split("/")

        executeCommand(command[0], message, command[1])
    }

    const command = commandsList.find(cmd => cmd.pattern.test(message.text))

    if (
        !message.isChat &&
        !message.session &&
        !command
    ) {
        return message.send("Я не знаю такой команды", {
            keyboard: privateKeyboard
        })
    }

    if (message.isChat && !command) return

    if (command.access === "private" && message.isChat) return message.send(
        "Эту команду можно использовать только в ЛС с ботом"
    )
    if (command.access === "chat" && !message.isChat) return message.send(
        "Эту команду можно использовать только в чате с ботом"
    )

    await next()
}

const getUser = async message => {
    return (await User.findOrCreate({
        where: { vkId: message.senderId },
        defaults: {
            vkId: message.senderId,
            name: (await vk.api.users.get({ user_ids: message.senderId }))[0]["first_name"]
        }
    }))[0]
}