import stringLength from "string-length"

import { config } from "../../../main.js"

export const changeNickname = {
    access: "private",
    pattern: /^(сменить ник(нейм)?|никнейм)$/i,
    handler: async message => {
        if (Number(message.user.balance) < 1_000_000) {
            return message.send(
                "Стоимость смены никнейма - 1 000 000. На вашем балансе недостаточно средств"
            )
        }

        const { text: nickname } = await message.question(
            `Стоимость смены никнейма - 1 000 000 ${config.bot.currency}, они будут списаны с вашего баланса.\n` +
            `Введите новый никнейм:`, {
                targetUserId: message.senderId
            })

        if (!nickname || stringLength(nickname) >= 16) {
            return message.send(
                "Максимальная длина никнейма с учётом пробелов, символов и эмодзи - 16 символов"
            )
        }

        message.user.name = nickname
        message.user.balance = Number(message.user.balance) - 1_000_000
        await message.user.save()

        await message.send(`Ты успешно установил никнейм «${nickname}»`)
    }
}