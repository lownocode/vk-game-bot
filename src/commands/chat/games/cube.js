import { config } from "../../../../main.js"
import { features } from "../../../utils/index.js"
import { depositKeyboard } from "../../../keyboards/index.js"
import { Rate } from "../../../db/models.js"
import { getOrCreateGame } from "../../../games/index.js"
import { gameBetAmountChecking } from "../../../functions/index.js"

export const cubeBet = {
    command: "bet-cube",
    pattern: /^$/,
    handler: async (message, data) => {
        if (Number(message.user.balance) < config.bot.minimumBet) {
            return message.send(
                `Для ставки на вашем балансе должно быть как минимум ` +
                `${features.split(config.bot.minimumBet)} ${config.bot.currency}`
            )
        }

        const betTypes = {
            noteven: "нечётное",
            even: "чётное"
        }
        const betType = /[1-6]/.test(data) ? `число ${data}` : betTypes[data]
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
            mode: "cube",
            data: {
                bet: data
            }
        })

        message.send(
            `✅ ${currentGame.isNewGame ? "Первая ставка" : "Ставка"} ` +
            `${features.split(betAmount)} ${config.bot.currency} на ${betType} принята!`
        )
    }
}