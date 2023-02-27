import { config } from "../../../../main.js"
import { declOfNum, features } from "../../../utils/index.js"
import { getCurrentGame, getOrCreateGame } from "../../../games/index.js"
import { createGameRate, gameBetAmountChecking } from "../../../functions/index.js"
import { depositKeyboard } from "../../../keyboards/index.js"

export const cupsBet = {
    command: "bet-cups",
    pattern: /^$/,
    handler: async (message, data) => {
        if (Number(message.user.balance) < config.bot.minimumBet) {
            return message.send(
                `Для ставки на вашем балансе должно быть как минимум ` +
                `${features.split(config.bot.minimumBet)} ${config.bot.currency}`
            )
        }

        message.state.gameId = (await getCurrentGame(message.peerId))?.id ?? "none"

        const betText = {
            "5": "все полные",
            "0": "все пустые"
        }[data] || `${data} ${declOfNum(data, ["полный", "полных", "полных"])}`

        const { text: _betAmount } = await message.question(
            `[id${message.user.vkId}|${message.user.name}], Введите ставку на ` +
            `${betText} (x${config.games.multipliers.cups[data]})`, {
                keyboard: depositKeyboard(message.user)
            }
        )

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
                filled: Number(data)
            }
        })

        message.send(
            `✅ ${currentGame.isNewGame ? "Первая ставка" : "Ставка"} ` +
            `${features.split(betAmount)} ${config.bot.currency} на ${betText} принята!`
        )
    }
}