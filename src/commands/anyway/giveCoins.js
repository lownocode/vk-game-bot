import { resolveResource } from "vk-io"

import { config, vk } from "../../../main.js"
import { User } from "../../db/models.js"
import { features, formatSum } from "../../utils/index.js"
import { confirmationKeyboard } from "../../keyboards/index.js"
import { logger } from "../../logger/logger.js"

export const giveCoins = {
    pattern: /^(\/give|\/выдать)\s(.*)(\s(.*))?$/i,
    handler: async message => {
        if (!message.user.isAdmin) return

        const toVkUserId = await getUserVkId(message)

        if (toVkUserId === 0) {
            return message.send("Цель перевода не найдена")
        }

        if (toVkUserId < 1) {
            return message.send("Выдавать группам, это, конечно, круто, но нельзя")
        }

        const user = await User.findOne({ where: { vkId: toVkUserId } })

        if (!user) {
            return message.send("Пользователь не зарегистрирован в боте")
        }

        const amount = formatSum(message.$match[2].split(" ")[0])

        if (
            !message.$match[2].split(" ")[0] ||
            !amount ||
            isNaN(amount)
        ) {
            return message.send("Сумма введена некорректно")
        }

        const { payload } = await message.question(
            `Вы уверены, что хотите выдать [id${user.vkId}|${user.name}] ` +
            `${features.split(amount)} ${config.bot.currency}?`, {
                targetUserId: message.senderId,
                keyboard: confirmationKeyboard,
            }
        )

        if (!payload?.confirm) return

        if (payload.confirm === "no") {
            return message.send("А жаль")
        }

        if (payload.confirm === "yes") {
            user.balance = Number(user.balance) + amount

            await message.user.save()
            await user.save()
            await vk.api.messages.send({
                peer_id: user.vkId,
                random_id: 0,
                message: (
                    `Вы получили ${features.split(amount)} ${config.bot.currency} от Администратора`
                )
            }).catch(() => logger.failure("ошибка выдачи"))

            return message.send("Успешно выдано")
        }
    }
}

const getUserVkId = async (message) => {
    if (message.replyMessage) {
        return message.replyMessage.senderId
    }

    if (message.forwards.length) {
        return message.forwards[0].senderId
    }

    if (message.$match[2]?.split(" ")[1]) {
        const res = await resolveResource({
            api: vk.api,
            resource: message.$match[2]?.split(" ")[1]
        })

        if (res.type === "group") return -res.id

        return res.id
    }

    return 0
}