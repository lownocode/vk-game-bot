import { config } from "../../../../main.js"
import { features } from "../../../utils/index.js"
import { depositKeyboard } from "../../../keyboards/index.js"
import { getOrCreateGame } from "../../../games/index.js"
import { Rate } from "../../../db/models.js"
import { gameBetAmountChecking } from "../../../functions/index.js"

export const doubleBet = {
    command: "bet-double",
    pattern: /^$/,
    handler: async (message, multiplier) => {
        if (Number(message.user.balance) < config.bot.minimumBet) {
            return message.send(
                `Для ставки на вашем балансе должно быть как минимум ` +
                `${features.split(config.bot.minimumBet)} ${config.bot.currency}`
            )
        }

        const betType = {
            2: "Black x2",
            3: "Red x3",
            5: "Blue x5",
            50: "Green x50",
        }[multiplier]

        const { text: _betAmount } = await message.question(
            `[id${message.user.vkId}|${message.user.name}], Введите ставку на ${betType}`, {
                targetUserId: message.senderId,
                keyboard: depositKeyboard(message.user)
            })

        const betAmount = await gameBetAmountChecking(_betAmount, message)

        if (typeof betAmount !== "number") return

        const currentGame = await getOrCreateGame(message.peerId)

        message.user.balance = Number(message.user.balance) - betAmount

        await message.user.save()
        await Rate.create({
            gameId: currentGame.id,
            peerId: message.peerId,
            userVkId: message.senderId,
            username: message.user.name,
            betAmount: betAmount,
            mode: "double",
            data: {
                multiplier: multiplier
            }
        })

        message.send(
            `✅ ${currentGame.isNewGame ? "Первая ставка" : "Ставка"} ` +
            `${features.split(betAmount)} ${config.bot.currency} на ${betType} принята!`
        )
    }
}