import { config } from "../../../../main.js"
import {features, formatSum} from "../../../utils/index.js"
import { depositKeyboard } from "../../../keyboards/index.js"
import {Rate} from "../../../db/models.js";
import {getOrCreateGame} from "../../../games/index.js";

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

        let betAmount = _betAmount.replace(/(вб|вабанк)/ig, Number(message.user.balance))

        if (!betAmount) {
            return message.send("Ты должен ввести cумму")
        }

        betAmount = formatSum(betAmount)

        if (!betAmount || isNaN(betAmount) || betAmount < config.bot.minimumBet) {
            return message.send(`Минимальная ставка - ${features.split(config.bot.minimumBet)}`)
        }

        if (betAmount > config.bot.max_bet) {
            return message.send(`Максимальная ставка - ${features.split(config.bot.max_bet)}`)
        }

        if (Number(message.user.balance) < betAmount) {
            return message.send(`На вашем счету недостаточно средств!`)
        }

        const currentGame = await getOrCreateGame(message.peerId)

        message.user.balance = Number(message.user.balance) - betAmount

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
        await message.user.save()

        message.send(
            `${currentGame.isNewGame ? "Первая ставка" : "Ставка"} ` +
            `${features.split(betAmount)} на ${betType} принята!`
        )
    }
}