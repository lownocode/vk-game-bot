import md5 from "md5"

import {
    confirmationKeyboard,
    depositKeyboard,
    gamesKeyboard,
    percentKeyboard
} from "../../keyboards/index.js"
import { features } from "../../utils/index.js"
import { config } from "../../../main.js"
import { formatAmount, formatSum } from "../../utils/index.js"

export const ball = {
    access: "private",
    pattern: /^мяч$/i,
    handler: async message => {
        const { text: _betAmount } = await message.question(
            "Вы играете в «Мяч».\n" +
            `Твой баланс: ${features.split(message.user.balance + message.user.bonusBalance)}\n` +
            "Укажите сколько коинов вы ставите на попадание в кольцо:", {
                targetUserId: message.peerId,
                keyboard: depositKeyboard(message.user)
            })

        if (!parseInt(_betAmount) || !_betAmount) {
            return message.send('Вернул вас в меню с играми', {
                keyboard: gamesKeyboard
            })
        }

        const betAmount = formatSum(_betAmount)

        if (!betAmount || isNaN(betAmount) || betAmount < 100000) {
            return message.send("Минимальная ставка - 100 000", {
                keyboard: gamesKeyboard
            })
        }

        if (betAmount > config.bot.max_bet) {
            return message.send(`Максимальная ставка - ${features.split(config.bot.max_bet)}`, {
                keyboard: gamesKeyboard
            })
        }

        if (Number(message.user.balance) < betAmount) {
            return message.send(`На вашем счету недостаточно средств!`, {
                keyboard: gamesKeyboard
            })
        }

        const { text: _percent } = await message.question(
            '🏀 Отлично! Теперь выберите дистанцию.\n' +
            'Чем больше дистанция, тем больше шанс попасть в кольцо, но меньше выиграть коинов.', {
                targetUserId: message.senderId,
                keyboard: percentKeyboard
            })

        const percent = parseInt(_percent)

        if (
            (percent !== 10) &&
            (percent !== 20) &&
            (percent !== 30) &&
            (percent !== 40) &&
            (percent !== 50) &&
            (percent !== 60)
        ) {
            return message.send('Неправильный запрос.', {
                keyboard: gamesKeyboard
            })
        }

        const coef = parseFloat(100 / parseInt(percent))
        const win = parseInt(betAmount * coef)
        let randomPercent = features.random.integer(1, 130)

        if (randomPercent >= 60) {
            randomPercent = features.random.integer(50, 100)
        }

        const salt = features.random.string(7)
        const hash =  md5(`${randomPercent}|BALL|${salt}`)

        const { payload: confirmation } = await message.question(
            `Дистанция: ${percent}.\n` +
            `Ставка: ${formatAmount(betAmount)}.\n` +
            `Вы можете выиграть: ${features.split(Math.abs(win))}.\n` +
            `Хэш: ${hash}\n` +
            `Бросать?`, {
                targetUserId: message.senderId,
                keyboard: confirmationKeyboard
            })

        if (!confirmation.command) {
            return message.send('Вернул вас в меню с играми', {
                keyboard: gamesKeyboard
            })
        }

        message.user.balance = Number(message.user.balance) + betAmount
        await message.user.save()

        if (percent >= randomPercent) {
            message.user.balance = Number(message.user.balance) + win

            await message.user.save()
            await message.send(
                `Поздравляем, вы попали в кольцо!\n` +
                `Строка для проверки: ${randomPercent}|BALL|${salt}\n` +
                `Минимальная дистанция для попадания была: ${randomPercent}\n\n` +
                `Вы выиграли ${features.split(Math.abs(win))} коинов.`, {
                    keyboard: gamesKeyboard
                })
        } else {
            message.send(
                `Жаль, но вы не попали в кольцо.\n` +
                `Минимальная дистанция для попадания была: ${randomPercent}.\n` +
                `Строка для проверки: ${randomPercent}|BALL|${salt}`, {
                    keyboard: gamesKeyboard
                })
        }
    }
}