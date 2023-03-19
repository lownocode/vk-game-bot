import { features } from "../../../utils/index.js"
import { depositKeyboard } from "../../../keyboards/index.js"
import { createGameRate, gameBetAmountChecking } from "../../../functions/index.js"
import { getCurrentGame, getOrCreateGame } from "../../../games/index.js"
import { config } from "../../../../main.js"

export const crashBet = {
    command: "bet-crash",
    pattern: /^$/,
    handler: async (message, data) => {
        if (Number(message.user.balance) < config.bot.minimumBet) {
            return message.reply(
                `Для ставки на вашем балансе должно быть как минимум ` +
                `${features.split(config.bot.minimumBet)} ${config.bot.currency}`
            )
        }

        message.state.gameId = (await getCurrentGame(message.peerId))?.id ?? "none"

        let point = -1

        if (data.includes("point_")) {
            point = parseFloat(data.split("point_")[1])
        }

        if (point === -1) {
            const { text: _coef } = await message.question(
                "Введите коэффициент, на который вы хотите поставить (например: 1.23):", {
                    forward: JSON.stringify({
                        is_reply: true,
                        peer_id: message.peerId,
                        conversation_message_ids: [message.conversationMessageId]
                    })
                }
            )

            const coef = parseFloat(_coef)

            if (!coef || isNaN(Number(coef)) || coef < 1.05 || coef > 1000) {
                return message.reply(
                    "Минимальный коэффициент: 1.05\n" +
                    "Максимальный коэффициент: 1000"
                )
            }

            point = coef
        }

        const { text: _betAmount } = await message.question(
            `Введите ставку на x${point}`, {
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
                point: point,
            }
        })

        message.reply(
            `✅ ${currentGame.isNewGame ? "Первая ставка" : "Ставка"} ` +
            `${features.split(betAmount)} ${config.bot.currency} на x${point} принята!` + (
                currentGame.isNewGame ? `\nХеш текущей игры: ${currentGame.hash}` : ""
            )
        )
    }
}