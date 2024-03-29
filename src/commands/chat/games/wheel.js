import { config } from "../../../../main.js"
import { features, formatSum } from "../../../utils/index.js"
import { depositKeyboard } from "../../../keyboards/index.js"
import { createGameRate, gameBetAmountChecking } from "../../../functions/index.js"
import { getCurrentGame, getOrCreateGame } from "../../../games/index.js"
import { Rate } from "../../../../db/models.js"

export const wheelBet = {
    command: "bet-wheel",
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
                mode: "wheel"
            },
            attributes: ["data"]
        })).map((item) => item.data)

        const limitations = {
            even: ["noteven"],
            noteven: ["even"],
            red: ["black"],
            black: ["red"],
            "1-18": ["19-36"],
            "19-36": ["1-18"],
            "1-12": ["13-24", "25-36"],
            "13-24": ["1-12", "25-36"],
            "25-36": ["1-12", "13-24"],
        }

        if (rates.find(r => limitations[data]?.includes(r.bet))) {
            return message.reply("Вы уже поставили на противоположное значение")
        }

        let number = -1

        const colorTitle = {
            red: "красное",
            black: "чёрное"
        }

        const evenNotevenTitles = {
            even: "чётное",
            noteven: "нечётное"
        }

        const betText = () => {
            if (["even", "noteven"].includes(data)) {
                return `${evenNotevenTitles[data]} (x${config.games.multipliers.wheel.parity})`
            }
            if (["red", "black"].includes(data)) {
                return `${colorTitle[data]} (x${config.games.multipliers.wheel.parity})`
            }
            if (["1-18", "19-36"].includes(data)) {
                return `промежуток ${data} (x${config.games.multipliers.wheel.parity})`
            }
            if (["1-12", "13-24", "25-36"].includes(data)) {
                return `промежуток ${data} (x${config.games.multipliers.wheel.interval})`
            }
        }

        if (data === "number") {
            const { text: _number } = await message.question(
                `Введите число, на которое хотите поставить`, {
                    forward: JSON.stringify({
                        is_reply: true,
                        peer_id: message.peerId,
                        conversation_message_ids: [message.conversationMessageId]
                    })
                })

            if (
                _number.split(" ").map(n => Number(n)).length >= 2 &&
                !_number.split(" ").map(n => isNaN(Number(n))).find(n => n) &&
                _number.split(" ").map(n => Number(n) >= 0 && Number(n) <= 36).find(n => !n) === undefined
            ) {
                number = Array(...new Set(_number.split(" ").map(n => Number(n))))
            }

            if (typeof number === "object") {
                const { text: _betAmount } = await message.question(
                    `[id${message.user.vkId}|${message.user.name}], Введите ставку на каждое из чисел: ` +
                    `${number.join(", ")}`, {
                        keyboard: depositKeyboard(message.user, number.length),
                        forward: JSON.stringify({
                            is_reply: true,
                            peer_id: message.peerId,
                            conversation_message_ids: [message.conversationMessageId]
                        })
                    })

                const betAmount = formatSum(_betAmount)

                if (betAmount * number.length > message.user.balance) {
                    return message.reply("У вас недостаточно средств на балансе")
                }

                const __betAmount = await gameBetAmountChecking(betAmount.toString(), message)

                if (typeof __betAmount !== "number") return

                const currentGame = await getOrCreateGame(message.peerId)

                if (message.state.gameId !== "none" && currentGame.id !== message.state.gameId) {
                    return message.reply("Игра, на которую вы ставили закончилась")
                }

                message.user.balance = Number(message.user.balance) - betAmount * number.length
                await message.user.save()

                for (const num of number) {
                    await createGameRate({
                        game: currentGame,
                        message: message,
                        betAmount: betAmount,
                        data: {
                            bet: data,
                            number: num
                        }
                    })
                }

                return await message.reply(
                    `Успешная ставка ${features.split(betAmount * number.length)} ${config.bot.currency} на ` +
                    `${number.join(", ")}`
                )
            } else {
                if (
                    !_number ||
                    isNaN(Number(_number)) ||
                    Number(_number) < 0 ||
                    Number(_number) > 36
                ) {
                    return message.send("Можно поставить только на число от 0 до 36")
                }

                number = Number(_number)
            }
        }

        const { text: _betAmount } = await message.question(
            `Введите ставку на ` +
            `${data === "number" ? `число ${number} (x${config.games.multipliers.wheel.number})` : betText()}`, {
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
            `✅ ${currentGame.isNewGame ? "Первая ставка" : "Ставка"} ` +
            `${features.split(betAmount)} ${config.bot.currency} на ` +
            `${data === "number" ? `число ${number}` : betText()} принята!` + (
                currentGame.isNewGame ? `\nХеш текущей игры: ${currentGame.hash}` : ""
            )
        )
    }
}