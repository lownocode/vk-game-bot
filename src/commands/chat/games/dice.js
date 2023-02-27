import { config } from "../../../../main.js"
import { features } from "../../../utils/index.js"
import { depositKeyboard } from "../../../keyboards/index.js"
import { getCurrentGame, getOrCreateGame } from "../../../games/index.js"
import { createGameRate, gameBetAmountChecking } from "../../../functions/index.js"
import { Rate } from "../../../../db/models.js"

export const diceBet = {
    command: "bet-dice",
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
                mode: "dice"
            },
            attributes: ["data"]
        })).map((item) => item.data)

        if (
            data === "even" && rates.find(r => r.bet === "noteven") ||
            data === "noteven" && rates.find(r => r.bet === "even")
        ) {
            return message.send("Вы уже поставили на противоположное значение")
        }

        const betTypes = {
            noteven: `нечётное (x${config.games.multipliers.dice.parity})`,
            even: `чётное (x${config.games.multipliers.dice.parity})`
        }
        const betType = /[1-6]/.test(data) ? `число ${data} (x${config.games.multipliers.dice.number})` : betTypes[data]
        const { text: _betAmount } = await message.question(
            `[id${message.user.vkId}|${message.user.name}], Введите ставку на ${betType}`, {
                targetUserId: message.senderId,
                keyboard: depositKeyboard(message.user)
            })

        const betAmount = await gameBetAmountChecking(_betAmount, message)

        if (typeof betAmount !== "number") return

        const currentGame = await getOrCreateGame(message.peerId)

        if ((Number(currentGame.endedAt) - Date.now()) <= 0) {
            return message.send("Игра уже кончается, ставки закрыты")
        }

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
            }
        })

        message.send(
            `✅ ${currentGame.isNewGame ? "Первая ставка" : "Ставка"} ` +
            `${features.split(betAmount)} ${config.bot.currency} на ${betType} принята!`
        )
    }
}