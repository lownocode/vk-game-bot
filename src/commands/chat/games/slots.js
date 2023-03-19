import { depositKeyboard } from "../../../keyboards/index.js"
import { config } from "../../../../main.js"
import { features } from "../../../utils/index.js"
import { getCurrentGame, getOrCreateGame } from "../../../games/index.js"
import { createGameRate, gameBetAmountChecking } from "../../../functions/index.js"

export const slotsBet = {
    command: "bet-slots",
    pattern: /^$/,
    handler: async (message, data) => {
        const multiplier = data.split("_")[0]
        const smile = config.games.slotsSmiles[data.split("_")[1] - 1]

        if (Number(message.user.balance) < config.bot.minimumBet) {
            return message.reply(
                `Для ставки на вашем балансе должно быть как минимум ` +
                `${features.split(config.bot.minimumBet)} ${config.bot.currency}`
            )
        }

        message.state.gameId = (await getCurrentGame(message.peerId))?.id ?? "none"

        const { text: _betAmount } = await message.question(
            `Введите ставку на x${multiplier} ${smile} (x${config.games.multipliers.slots[multiplier - 1]})`, {
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
                multiplier: Number(multiplier),
                smile: config.games.slotsSmiles.findIndex(_smile => _smile === smile),
            }
        })

        message.reply(
            `✅ ${currentGame.isNewGame ? "Первая ставка" : "Ставка"} ` +
            `${features.split(betAmount)} ${config.bot.currency} x${multiplier} ${smile} принята!` + (
                currentGame.isNewGame ? `\nХеш текущей игры: ${currentGame.hash}` : ""
            )
        )
    }
}