import { config } from "../../../../main.js"
import { features } from "../../../utils/index.js"
import { depositKeyboard } from "../../../keyboards/index.js"
import { gameBetAmountChecking } from "../../../functions/index.js"
import { Rate } from "../../../db/models.js"
import { getOrCreateGame } from "../../../games/index.js"

export const wheelBet = {
    command: "bet-wheel",
    pattern: /^$/,
    handler: async (message, data) => {
        if (Number(message.user.balance) < config.bot.minimumBet) {
            return message.send(
                `Для ставки на вашем балансе должно быть как минимум ` +
                `${features.split(config.bot.minimumBet)} ${config.bot.currency}`
            )
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
                `[id${message.user.vkId}|${message.user.name}], Введите число, на которое хотите поставить`, {
                    targetUserId: message.senderId,
                })

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

        const { text: _betAmount } = await message.question(
            `[id${message.user.vkId}|${message.user.name}], Введите ставку на ` +
            `${data === "number" ? `число ${number} (x${config.games.multipliers.wheel.number})` : betText()}`, {
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
            userVkId: message.user.vkId,
            username: message.user.name,
            betAmount: betAmount,
            mode: "wheel",
            data: {
                bet: data,
                number: number
            }
        })

        message.send(
            `✅ ${currentGame.isNewGame ? "Первая ставка" : "Ставка"} ` +
            `${features.split(betAmount)} ${config.bot.currency} на ` +
            `${data === "number" ? `число ${number}` : betText()} принята!`
        )
    }
}