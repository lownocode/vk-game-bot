import { config } from "../../../../main.js"
import { features } from "../../../utils/index.js"
import { depositKeyboard } from "../../../keyboards/index.js"
import { getCurrentGame, getOrCreateGame } from "../../../games/index.js"
import { createGameRate, gameBetAmountChecking } from "../../../functions/index.js"

export const doubleBet = {
    command: "bet-double",
    pattern: /^$/,
    handler: async (message, multiplier) => {
        if (Number(message.user.balance) < config.bot.minimumBet) {
            return message.reply(
                `Для ставки на вашем балансе должно быть как минимум ` +
                `${features.split(config.bot.minimumBet)} ${config.bot.currency}`
            )
        }

        message.state.gameId = (await getCurrentGame(message.peerId))?.id ?? "none"

        const { text: _betAmount } = await message.question(
            `[id${message.user.vkId}|${message.user.name}], Введите ставку на x${multiplier}`, {
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
                multiplier: multiplier
            }
        })

        message.reply(
            `✅ ${currentGame.isNewGame ? "Первая ставка" : "Ставка"} ` +
            `${features.split(betAmount)} ${config.bot.currency} на x${multiplier} принята!` + (
                currentGame.isNewGame ? `\nХеш текущей игры: ${currentGame.hash}` : ""
            )
        )
    }
}