import { User } from "../../db/models.js"
import { detectDiscount } from "../functions/index.js"
import { logger } from "../logger/logger.js"
import { features } from "../utils/index.js"
import { config, vk } from "../../main.js"

export const handlePayokPayment = async (event) => {
    console.log(event)

    if (!event.custom || !event.custom.userId) return

    const user = await User.findOne({
        attributes: ["id", "balance", "vkId"],
        where: {
            id: event.custom.userId
        }
    })

    if (!user) return

    const sum = Math.trunc(Number(event.amount))
    const coins = (sum * 1000) + ((sum * 1000) * (detectDiscount(sum) / 100))

    user.balance = Number(user.balance) + coins
    await user.save()

    await vk.api.messages.send({
        random_id: 0,
        peer_id: user.vkId,
        message: `✅ Успешное пополнение ${features.split(coins)} ${config.bot.currency}`
    }).catch((err) => {
        logger.failure(`ошибка при отправке сообщения о пополнении юзеру с айди ${user.id}\n\n${err}`)
    })
}