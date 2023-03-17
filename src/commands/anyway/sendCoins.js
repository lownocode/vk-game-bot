import { resolveResource } from "vk-io"

import { config, vk } from "../../../main.js"
import { User } from "../../../db/models.js"
import { features, formatSum } from "../../utils/index.js"
import { confirmationKeyboard } from "../../keyboards/index.js"
import { createTransaction } from "../../functions/index.js"

export const sendCoins = {
    pattern: /^(перевод|передать|перевести)\s(.*)(\s(.*))?$/i,
    handler: async message => {
        const toVkUserId = await getUserVkId(message)

        if (toVkUserId === 0) {
            return message.send("Цель перевода не найдена")
        }

        if (toVkUserId < 1) {
            return message.send("Переводить группам, это, конечно, круто, но нельзя")
        }

        if (toVkUserId === message.senderId) {
            return message.send("Переводить самому себе нельзя")
        }

        const user = await User.findOne({ where: { vkId: toVkUserId } })

        if (!user) {
            return message.send("Пользователь не зарегистрирован в боте")
        }

        const amount = formatSum(message.$match[2].split(" ")[0], message)

        if (
            !amount ||
            isNaN(amount)
        ) {
            return message.send("Сумма введена некорректно")
        }

        const { payload } = await message.question(
            `Вы уверены, что хотите перевести [id${user.vkId}|${user.name}] ` +
            `${features.split(amount)} ${config.bot.currency}?`, {
                targetUserId: message.senderId,
                keyboard: confirmationKeyboard,
            }
        )

        if (!payload?.confirm) return

        if (payload.confirm === "no") {
            return message.send(
                `Вот и остался [id${user.vkId}|${user.name}] без ${features.split(amount)} ${config.bot.currency} :(`
            )
        }

        if (payload.confirm === "yes") {
            if (Number(message.user.balance) < amount) {
                return message.send("У вас недостаточно средств для перевода")
            }

            await createTransaction({
                recipient: user.vkId,
                sender: message.user.vkId,
                amount: amount
            })

            return message.reply("Успешно переведено")
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