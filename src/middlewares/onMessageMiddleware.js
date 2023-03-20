import { commandsList, config, vk } from "../../main.js"
import { chatMainKeyboard, chooseChatStatusKeyboard, privateKeyboard } from "../keyboards/index.js"
import { executeCommand } from "../functions/index.js"
import { Chat, User } from "../../db/models.js"

export const onMessageMiddleware = async (message, next) => {
    if (message.text) {
        message.text = message.text.replace(/^\[club(\d+)\|(.*)]/i, "").trim()
    }

    if (message.isGroup || !message.text || message.senderType !== "user") return

    if (message.referralValue && !isNaN(Number(message.referralValue))) {
        const user = await getUser(message)
        const referrer = await User.findOne({
            attributes: ["id", "balance", "name", "vkId"],
            where: { vkId: Number(message.referralValue) }
        })

        if (
            !referrer ||
            user.referrer === referrer.vkId ||
            user.referrer ||
            referrer.vkId === message.senderId ||
            +new Date(user.createdAt) + 1_800_000 < Date.now()
        ) {
            return message.send("Что-то пошло не так")
        }

        referrer.balance = Number(referrer.balance) + 250_000
        user.balance = Number(user.balance) + 250_000
        user.referrer = referrer.vkId

        await referrer.save()
        await user.save()

        await vk.api.messages.send({
            random_id: 0,
            peer_id: referrer.vkId,
            message: (
                `[id${user.vkId}|${user.name}] присоединился по вашей реферальной ссылке\n` +
                `+ 250K ${config.bot.currency}`
            )
        })

        return message.send(
            `Вы стали рефералом [id${referrer.vkId}|${referrer.name}]\n` +
            `На ваш баланс начислено 250K ${config.bot.currency}`
        )
    }

    const command = commandsList.find(cmd => cmd.pattern.test(message.text))

    if (command || message.messagePayload?.command) {
        if (message.isChat) {
            const chat = await Chat.findOne({ where: { peerId: message.peerId } })

            if (!chat) {
                return message.send(
                    "⚠ Ошибка! Ваша беседа не зарегистрирована.\n" +
                    "🌟 Решить эту проблему можно путём добавления бота в беседу повторно."
                )
            }

            if (
                (
                    !chat.payedFor ||
                    !chat.status ||
                    chat.status === "expired" ||
                    Number(chat.payedFor) < Date.now()
                ) &&
                !["chooseChatStatus", "chooseChatMode"].includes(command?.command || message.messagePayload?.command?.split("/")[0])
            ) {
                return message.send(
                    "Команды станут доступны только после оплаты статуса беседы", {
                        keyboard: chooseChatStatusKeyboard()
                    }
                )
            }

            message.chat = chat
        }

        message.user = await getUser(message)
    }

    if (message.messagePayload?.command) {
        const command = message.messagePayload?.command?.split("/")

        const cmd = command[0]?.split("bet-")?.[1]

        if (command[0]?.includes("bet") && cmd !== message.chat.mode) {
            return await vk.api.messages.send({
                random_id: 0,
                message: "Клавиатура в вашей беседе установлена неверно, обновляю...",
                peer_id: message.chat.peerId,
                keyboard: chatMainKeyboard(message.chat.mode)
            })
        }

        executeCommand(command[0], message, command[1])
    }

    if (
        !message.isChat &&
        !message.session &&
        !command
    ) {
        return message.send("Я не знаю такой команды", {
            keyboard: privateKeyboard
        })
    }

    if (
        message.isChat && !command ||
        command.access === "private" && message.isChat ||
        command.access === "chat" && !message.isChat
    ) return

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