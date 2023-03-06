import { Keyboard } from "vk-io"

import { modeKeyboard } from "../../keyboards/index.js"
import { Chat } from "../../../db/models.js"
import { config } from "../../../main.js"
import { declOfNum, features, formatSum } from "../../utils/index.js"
import { readableDate } from "../../functions/index.js"
import Sequelize from "sequelize";

export const chooseChatStatus = {
    command: "chooseChatStatus",
    pattern: /^$/,
    handler: async (message, percent) => {
        const status = config.payedChatsStatuses.find(s => s.percent === Number(percent))

        if (!status) {
            return message.send("Ой, ошибочка вышла. Попробуйте позже")
        }

        const { text: _days } = await message.question(
            `Отлично, вы выбрали статус за ${features.split(status.cost)} ${config.bot.currency} в день.\n\n` +
            `Теперь введите количество дней, которое хотите оплатить`, {
                keyboard: daysKeyboard
            }
        )

        const days = formatSum(_days)

        if (
            !days ||
            isNaN(Number(days)) ||
            Number(days) < 3 ||
            Number(days) > 365
        ) {
            return message.send(
                "Минимальное количество дней - 3\n" +
                "Максимальное количество дней - 365"
            )
        }

        const cost = status.cost * days

        if (Number(message.user.balance) < cost) {
            return message.send(
                "У вас недостаточно средств на балансе для оплаты такого количества дней\n" +
                `Вам не хватает ${features.split(cost - Number(message.user.balance))} ${config.bot.currency}`
            )
        }

        const chatPayedFor = Date.now() + (86_400_000 * days)

        message.user.balance = Number(message.user.balance) - cost

        await message.user.save()
        await Chat.update({
            status: status.percent,
            payer: message.senderId,
            payedFor: Sequelize.literal(`"payedFor"+ ${chatPayedFor}`)
        }, {
            where: {
                peerId: message.peerId
            }
        })

        await message.send(
            `✨ Чат успешно оплачен. Теперь вы получаете ${status.percent}% со всех ставок в этой беседе.\n` +
            `Платный статус беседы заканчивается через ${days} ` +
            `${declOfNum(days, ["день", "дня", "дней"])} - ${readableDate(Number(message.chat.payedFor) + chatPayedFor)}.\n\n` +
            "Теперь выберите один из предложенных режимов", {
                keyboard: modeKeyboard()
            }
        )
    }
}

const daysKeyboard = Keyboard.builder()
    .textButton({
        label: "3",
        color: Keyboard.PRIMARY_COLOR
    })
    .textButton({
        label: "7",
        color: Keyboard.PRIMARY_COLOR
    })
    .textButton({
        label: "14",
        color: Keyboard.PRIMARY_COLOR
    })
    .textButton({
        label: "30",
        color: Keyboard.PRIMARY_COLOR
    })
    .textButton({
        label: "60",
        color: Keyboard.PRIMARY_COLOR
    })
    .inline()