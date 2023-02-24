import { Keyboard } from "vk-io"

import { config } from "../../../../main.js"
import { features, formatSum } from "../../../utils/index.js"
import { depositKeyboard } from "../../../keyboards/index.js"
import { createGameRate, gameBetAmountChecking } from "../../../functions/index.js"
import { getCurrentGame, getOrCreateGame } from "../../../games/index.js"
import { Rate } from "../../../db/models.js"

export const under7overBet = {
    command: "bet-under7over",
    pattern: /^$/,
    handler: async (message, data) => {
        if (Number(message.user.balance) < config.bot.minimumBet) {
            return message.send(
                `Для ставки на вашем балансе должно быть как минимум ` +
                `${features.split(config.bot.minimumBet)} ${config.bot.currency}`
            )
        }

        message.state.gameId = (await getCurrentGame(message.peerId))?.id ?? "none"

        const rates = (await Rate.findAll({
            where: {
                peerId: message.peerId,
                userVkId: message.senderId,
                mode: "under7over"
            },
            attributes: ["data"]
        })).map((item) => item.data)

        if (
            data === "under" && rates.find(r => ["7", "over"].includes(r.bet)) ||
            data === "over" && rates.find(r => ["under", "7"].includes(r.bet)) ||
            data === "7" && rates.find(r => ["under", "over"].includes(r.bet)) ||
            data === "under" && rates.find(r => r.number > 7) ||
            data === "over" && rates.find(r => r.number < 7) ||
            data === "number" && rates.find(r => r.bet === "7")
        ) {
            return message.send("Вы уже поставили на противоположное значение")
        }

        if (rates.filter(r => r.bet === "number")?.length >= 4) {
            return message.send("Максимальное количесво ставок на числа в одной игре - 4")
        }

        let number = -1

        const betName = {
            under: `меньше 7 (x${config.games.multipliers.under7over.underOver})`,
            over: `больше 7 (x${config.games.multipliers.under7over.underOver})`,
            7: `ровно 7 (x${config.games.multipliers.under7over["7"]})`,
        }[data]

        if (data === "number") {
            const { text: _number } = await message.question(
                `[id${message.user.vkId}|${message.user.name}], Введите число, на которое хотите поставить`, {
                    targetUserId: message.senderId,
                    keyboard: numbersKeyboard()
                })

            const __number = formatSum(_number)

            if (
                !__number ||
                isNaN(Number(__number)) ||
                Number(__number) < 2 ||
                Number(__number) > 12 ||
                Number(__number) === 7
            ) {
                return message.send("Можно поставить только на число от 2 до 12 не включая 7")
            }

            number = Number(__number)
        }

        const { text: _betAmount } = await message.question(
            `[id${message.user.vkId}|${message.user.name}], Введите ставку на ` +
            `${data === "number" ? `число ${number} (x${config.games.multipliers.under7over[number]})` : betName}`, {
                targetUserId: message.senderId,
                keyboard: depositKeyboard(message.user)
            })

        const betAmount = await gameBetAmountChecking(_betAmount, message)

        if (typeof betAmount !== "number") return

        const currentGame = await getOrCreateGame(message.peerId)

        if (message.state.gameId !== "none" && currentGame.id !== message.state.gameId) {
            return message.send("Игра, на которую вы ставили закончилась")
        }

        message.user.balance = Number(message.user.balance) - betAmount

        await message.user.save()
        await createGameRate({
            game: currentGame,
            message: message,
            betAmount: betAmount,
            data: {
                bet: data,
                number: number
            }
        })

        message.send(
            `✅ ${1 ? "Первая ставка" : "Ставка"} ` +
            `${features.split(betAmount)} ${config.bot.currency} на ` +
            `${data === "number" ? `число ${number}` : betName} принята!`
        )
    }
}

const numbersKeyboard = () => {
    const keyboard = Keyboard.builder()

    for (const numbers of [[2, 3, 4, 5, 6], [8, 9, 10, 11, 12]]) {
        for (const number of numbers) {
            keyboard.textButton({
                label: number,
                color: Keyboard.PRIMARY_COLOR
            })
        }

        keyboard.row().inline()
    }

    return keyboard
}