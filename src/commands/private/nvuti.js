import md5 from "md5"

import { depositKeyboard, gamesKeyboard, percentKeyboard } from "../../keyboards/index.js"
import { features, formatSum } from "../../utils/index.js"
import { config } from "../../../main.js"

export const nvuti = {
    access: "private",
    pattern: /^(nvuti|нвути)$/i,
    handler: async message => {
        if (Number(message.user.balance) < 100_000) {
            return message.send('Минимальный баланс для ставки - 100 000', {
                keyboard: gamesKeyboard
            })
        }

        const range = {
            minimum: 50000,
            maximum: 1560000,
        }

        let number = features.random.integer(range.minimum, range.maximum)

        if (number > 1000000) {
            number = features.random.integer(930000, 1000000)
        }

        let salt = features.random.string(features.random.integer(6, 24))
        const hash = md5(`${number}|${salt}`)

        const { text: _betAmount } = await message.question(
            `Отлично, введи ставку (от 100 000 ${config.bot.currency})\n\n` +
            `🔒 Хеш данной игры: [${hash}]`, {
                keyboard: depositKeyboard(message.user),
                targetUserId: message.peerId
            })

        if(!parseInt(_betAmount) || !_betAmount) {
            return message.send('Вернул вас в меню с играми', {
                keyboard: gamesKeyboard
            })
        }

        const betAmount = formatSum(_betAmount)

        if (!betAmount || isNaN(betAmount) || betAmount < 100000) {
            return message.send('Минимальная ставка - 100 000', {
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
            message.user.balance = Number(message.user.balance) + amount
            await message.user.save()

            await message.send(
                `Итог игры:\n` +
                `💰 Ты поставил ${features.split(betAmount)} ${config.bot.currency} и выиграл.\n` +
                `🎱 Выпало число ${features.split(number)}, а ты поставил до ${features.split(chance * 10000)} (${chance}%)!\n\n` +
                `🔒 Хеш данной игры: [${hash}]\n` +
                `📜 Зашифрованный текст: [${number}|${salt}]`, {
                keyboard: gamesKeyboard
            })
        } else {
            message.user.balance = Number(message.user.balance) - betAmount
            await message.user.save()

            await message.send(
                `Итог игры:\n` +
                `💰 Ты поставил ${features.split(betAmount)} EC и проиграл.\n` +
                `🎱 Выпало число ${features.split(number)}, а ты поставил до ${features.split(chance * 10000)} (${chance}%)!\n\n` +
                `🔒 Хеш данной игры: [${hash}]\n` +
                `📜 Зашифрованный текст: [${number}|${salt}]`, {
                keyboard: gamesKeyboard
            })
        }
    }
}