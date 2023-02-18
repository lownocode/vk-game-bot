import md5 from "md5"

import { depositKeyboard, gamesKeyboard, percentKeyboard } from "../../keyboards/index.js"
import { features, formatSum } from "../../utils/index.js"
import { config } from "../../main.js"

export const cube = {
    access: "private",
    pattern: /^(cube|кубик)$/i,
    handler: async message => {
        if (message.user.balance + message.user.bonusBalance < 100000) {
            return message.send('Минимальный баланс для ставки 100 000', {
                keyboard: gamesKeyboard
            })
        }

        const number = features.random.integer(1, 6)
        const salt = features.random.string(features.random.integer(6, 24))
        const hash = md5(`${number}|${salt}`)

        const { text: _betAmount } = await message.question(
            `Отлично, введи ставку (от 100 000 EC)\n\n` +
            `🔒 Хеш данной игры: [${hash}]`, {
                keyboard: depositKeyboard(message.user),
                targetUserId: message.peerId
            })

        if (!parseInt(_betAmount) || !_betAmount) {
            return message.send('Вернул вас в меню с играми', {
                keyboard: gamesKeyboard
            })
        }

        const betAmount = formatSum(_betAmount)

        if (!betAmount || isNaN(betAmount) || betAmount < 100000) {
            return message.send('Мин. Ставка 100 000', {
                keyboard: gamesKeyboard
            })
        }

        if (betAmount > config.bot.max_bet) {
            return message.send(`Максимальная ставка - ${features.split(config.bot.max_bet)}`, {
                keyboard: gamesKeyboard
            })
        }

        if (message.user.balance + message.user.bonusBalance < betAmount) {
            return message.send(`На вашем счету недостаточно средств!`, {
                keyboard: gamesKeyboard
            })
        }

        const percent = await message.question('Отлично! Теперь введи шанс выигрыша. ', {
            targetUserId: message.senderId,
            keyboard: percentKeyboard
        })

        const input = percent.payload ? percent.payload.command : percent.text
        const chance = Number.parseInt(input)

        if (!chance || chance < 1 || chance > 95) {
            return message.send('Ты должен был ввести шанс от 1 до 95.', {
                keyboard: gamesKeyboard
            })
        }

        const win = number <= chance * 10000
        const amount = chance !== 50
            ? (betAmount * 100 / (chance + 2.5)) - betAmount
            : (betAmount * 100 / (chance)) - betAmount

        if (win) {
            message.user.balance += amount
            await message.user.save()

            await message.send(
                `Итог игры:\n` +
                `💰 Ты поставил ${features.split(betAmount)} EC и выиграл.\n` +
                `🎱 Выпало число ${features.split(number)}, а ты поставил до ${features.split(chance * 10000)} (${chance}%)!\n\n` +
                `🔒 Хеш данной игры: [${hash}]\n` +
                `📜 Зашифрованный текст: [${number}|${salt}]`, {
                keyboard: gamesKeyboard
            })
        } else {
            if (betAmount >= message.user.balance) {
                message.user.bonusBalance -= betAmount - message.user.balance
                message.user.balance = 0
                message.user.save()
            } else {
                message.user.balance -= betAmount
                message.user.save()
            }

            await message.send(
                `Итог игры:\n`
                `💰 Ты поставил ${features.split(betAmount)} EC и проиграл.\n`
                `🎱 Выпало число ${features.split(number)}, а ты поставил до ${features.split(chance * 10000)} (${chance}%)!\n\n`
                `🔒 Хеш данной игры: [${hash}]\n` +
                `📜 Зашифрованный текст: [${number}|${salt}]`, {
                keyboard: gamesKeyboard
            })
        }
    }
}