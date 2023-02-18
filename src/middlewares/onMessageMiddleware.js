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
            message.chat = await getChat(message)
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
        const user = await getUser(message)

        return message.send("Я не знаю такой команды", {
            keyboard: privateKeyboard(user)
        })
    }

    if (message.isChat && !command) return

    if (command.access === "private" && message.isChat) return message.send(
        "Эту команду можно использовать только в ЛС с ботом"
    )
    if (command.access === "chat" && !message.isChat) return message.send(
        "Эту команду можно использовать только в чате"
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

const getChat = async message => {
    return (await Chat.findOrCreate({
        where: { peerId: message.peerId },
        defaults: {
            peerId: message.peerId,
        }
    }))[0]
}