import crypto from "crypto"

import { features, formatSum } from "../../utils/index.js"
import { config } from "../../../main.js"
import { confirmationKeyboard } from "../../keyboards/index.js"
import { Promocode } from "../../../db/models.js"

export const createPromocode = {
    access: "private",
    pattern: /создать\sпромокод\s(.*)\s(.*)/i,
    handler: async message => {
        const usages = formatSum(message.$match[1])
        const amount = formatSum(message.$match[2])

        if (!amount || !usages) {
            return message.reply(
                `Использование:\n` +
                `Создать промокод {кол-во активаций} {награда за активацию}`
            )
        }

        if (amount <= 0 || usages <= 0) {
            return message.reply(
                `Неверно указано количество активаций или сумма`
            )
        }

        if ((usages * amount) > Number(message.user.balance)) {
            return message.reply(
                `Стоимость создания промокода превышает ваш баланс`
            )
        }

        if (usages > 500_000) {
            return message.reply(
                "Максимальное число активаций - 500 000"
            )
        }

        const { payload } = await message.question(
            `Стоимость создания промокода - ${features.split(usages * amount)} ${config.bot.currency}\n` +
            `Количество активаций: ${features.split(usages)}\n` +
            `Награда за одну активацию: ${features.split(amount)}\n\n` +
            `Вы уверены, что хотите создать промокод?`, {
                keyboard: confirmationKeyboard
            }
        )

        if (!payload || payload.confirm === "no") {
            return message.reply("Создание промокода отменено")
        }

        const code = crypto.randomBytes(5).toString("hex")

        message.user.balance = Number(message.user.balance) - (usages * amount)
        await message.user.save()
        await Promocode.create({
            code: code,
            usages: usages,
            reward: amount
        })

        message.reply(
            `Промокод успешно создан, отправляю его следующим сообщением для удобного копирования`
        )

        message.send(code)
    }
}