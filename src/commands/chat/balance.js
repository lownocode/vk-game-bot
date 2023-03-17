import { features } from "../../utils/index.js"
import { config, vk } from "../../../main.js"
import { resolveResource } from "vk-io"
import { User } from "../../../db/models.js"

export const balance = {
    access: "chat",
    pattern: /^(balance|баланс|бал)(\s(.*))?$/i,
    handler: async message => {
        const toVkUserId = await getUserVkId(message)

        if (toVkUserId <= 0) {
            return message.send("Цель не найдена")
        }

        const user = await User.findOne({
            attributes: ["balance", "vkId", "name"],
            where: { vkId: toVkUserId }
        })

        if (!user) {
            return message.send("Пользователь не зарегистрирован")
        }

        message.reply(
            (
                toVkUserId === message.senderId
                    ? `Ваш баланс: `
                    : `Баланс [id${user.vkId}|${user.name}]: `
            ) +
            `${features.split(user.balance)} ${config.bot.currency}\n`, {
                disable_mentions: true
            }
        )
    }
}

const getUserVkId = async (message) => {
    if (message.replyMessage) {
        return message.replyMessage.senderId
    }

    if (message.forwards.length) {
        return message.forwards[0].senderId
    }

    if (message.$match[1]?.split(" ")[1]) {
        const res = await resolveResource({
            api: vk.api,
            resource: message.$match[1]?.split(" ")[1]
        })

        if (res.type === "group") return -res.id

        return res.id
    }

    return message.senderId
}