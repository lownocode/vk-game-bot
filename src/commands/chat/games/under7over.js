import { Keyboard } from "vk-io"

import { config } from "../../../../main.js"
import { features, formatSum } from "../../../utils/index.js"
import { depositKeyboard } from "../../../keyboards/index.js"
import { createGameRate, gameBetAmountChecking } from "../../../functions/index.js"
import { getCurrentGame, getOrCreateGame } from "../../../games/index.js"
import { Rate } from "../../../../db/models.js"

export const under7overBet = {
    command: "bet-under7over",
    pattern: /^$/,
    handler: async (message, data) => {
        if (Number(message.user.balance) < config.bot.minimumBet) {
            return message.reply(
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
            data === "over" && rates.find(r => r.bet === "number" && r.number < 7) ||
            data === "under" && rates.find(r => r.bet === "number" && r.number > 7) ||
            data === "over" && rates.find(r => ["7", "under"].includes(r.bet)) ||
            data === "under" && rates.find(r => ["7", "over"].includes(r.bet))  ||
            data === "7" && rates.find(r => ["under", "over"].includes(r.bet))
        ) {
            return message.reply("Вы уже поставили на противоположное значение")
        }

        if (rates.filter(r => r.bet === "number")?.length >= 4) {
            return message.reply("Максимальное количесво ставок на числа в одной игре - 4")
        }

        let number = -1

        const betName = {
            under: `меньше 7 (x${config.games.multipliers.under7over.underOver})`,
            over: `больше 7 (x${config.games.multipliers.under7over.underOver})`,
            7: `ровно 7 (x${config.games.multipliers.under7over["7"]})`,
        }[data]

        if (data === "number") {
            const { text: _number } = await message.question(
                `Введите число, на которое хотите поставить`, {
                    targetUserId: message.senderId,
                    keyboard: numbersKeyboard(),
                    forward: JSON.stringify({
                        is_reply: true,
                        peer_id: message.peerId,
                        conversation_message_ids: [message.conversationMessageId]
                    })
                })

            const __number = formatSum(_number)

            if (
                !__number ||
                isNaN(Number(__number)) ||
                Number(__number) < 2 ||
                Number(__number) > 12 ||
                Number(__number) === 7
            ) {
                return message.reply("Можно поставить только на число от 2 до 12 не включая 7")
            }

            if (
                rates.find(r => r.bet === "under" && Number(__number) > 7) ||
                rates.find(r => r.bet === "over" && Number(__number) < 7) ||
                Number(__number) < 7 && rates.find(r => r.bet === "number" && r.number > 7) ||
                Number(__number) > 7 && rates.find(r => r.bet === "number" && r.number < 7)
            ) {
                return message.reply("Вы уже поставили на противоположное значение")
            }

            number = Number(__number)
        }

        const { text: _betAmount } = await message.question(
            `Введите ставку на ` +
            `${data === "number" ? `число ${number} (x${config.games.multipliers.under7over[number]})` : betName}`, {
                targetUserId: message.senderId,
                keyboard: depositKeyboard(message.user),
                forward: JSON.stringify({
                    is_reply: true,
                    peer_id: message.peerId,
                    conversation_message_ids: [message.conversationMessageId]
                })
            })

        const betAmount = await gameBetAmountChecking(_betAmount, message)

        if (typeof betAmount !== "number") return

        const currentGame = await getOrCreateGame(message.peerId)

        if ((Number(currentGame.endedAt) - Date.now()) <= 0) {
            return message.reply("Игра уже кончается, ставки закрыты")
        }

        if (message.state.gameId !== "none" && currentGame.id !== message.state.gameId) {
            return message.reply("Игра, на которую вы ставили закончилась")
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

        message.reply(
            `✅ ${1 ? "Первая ставка" : "Ставка"} ` +
            `${features.split(betAmount)} ${config.bot.currency} на ` +
            `${data === "number" ? `число ${number}` : betName} принята!` + (
                currentGame.isNewGame ? `\nХеш текущей игры: ${currentGame.hash}` : ""
            )
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