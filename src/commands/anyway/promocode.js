import { Promocode } from "../../../db/models.js"
import { features } from "../../utils/index.js"
import { config } from "../../../main.js"

export const promocode = {
    pattern: /^(промо|промокод)\s(.*)$/i,
    handler: async message => {
        if (!message.$match[2]) {
            return message.reply("Промокод не введен")
        }

        const promocode = await Promocode.findOne({
            where: {
                code: message.$match[2]
            }
        })

        if (!promocode) {
            return message.reply(
                `Промокода не существует`
            )
        }

        if (promocode.usages <= 0) {
            return message.reply(
                "Этот промокод исчерпал лимит активаций"
            )
        }

        if (promocode.activations.includes(message.user.id)) {
            return message.reply(
                "Вы уже активировали этот промокод"
            )
        }

        message.user.balance = Number(message.user.balance) + Number(promocode.reward)
        promocode.activations = [...promocode.activations, message.user.id]
        promocode.usages -= 1

        await message.user.save()
        await promocode.save()
        await message.reply(
            "Промокод успешно активирован\n" +
            `На ваш баланс зачислено ${features.split(Number(promocode.reward))} ${config.bot.currency}\n` +
            `Осталось активаций промокода: ${promocode.usages}`
        )
    }
}