import { depositKeyboard } from "../../../keyboards/index.js"
import { config } from "../../../../main.js"
import { features } from "../../../utils/index.js"
import { getOrCreateGame } from "../../../games/index.js"
import { createGameRate, gameBetAmountChecking } from "../../../functions/index.js"

export const slotsBet = {
    command: "bet-slots",
    pattern: /^$/,
    handler: async (message, data) => {
        const multiplier = data.split("_")[0]
        const smile = config.games.slotsSmiles[data.split("_")[1] - 1]

        if (Number(message.user.balance) < config.bot.minimumBet) {
            return message.send(
                `Для ставки на вашем балансе должно быть как минимум ` +
                `${features.split(config.bot.minimumBet)} ${config.bot.currency}`
            )
        }

        const { text: _betAmount } = await message.question(
            `[id${message.user.vkId}|${message.user.name}], Введите ставку на ` +
            `x${multiplier} ${smile} (x${config.games.multipliers.slots[multiplier - 1]})`, {
            targetUserId: message.senderId,
            keyboard: depositKeyboard(message.user)
        })

        const betAmount = await gameBetAmountChecking(_betAmount, message)

        if (typeof betAmount !== "number") return

        const currentGame = await getOrCreateGame(message.peerId)

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

        message.send(
            `✅ ${currentGame.isNewGame ? "Первая ставка" : "Ставка"} ` +
            `${features.split(betAmount)} ${config.bot.currency} x${multiplier} ${smile} принята!`
        )
    }
}