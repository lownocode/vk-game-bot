import { config } from "../../../../main.js"
import { features, formatSum } from "../../../utils/index.js"
import { depositKeyboard } from "../../../keyboards/index.js"
import { getOrCreateGame } from "../../../games/index.js"
import { Rate } from "../../../db/models.js"

export const basketballBet = {
    command: "bet-basketball",
    pattern: /^$/,
    handler: async (message, color) => {
        if (Number(message.user.balance) < config.bot.minimumBet) {
            return message.send(
                `Для ставки на вашем балансе должно быть как минимум ` +
                `${features.split(config.bot.minimumBet)} ${config.bot.currency}`
            )
        }

        const betTeam = {
            red: "победу красных",
            nobody: "ничью",
            black: "победу чёрных",
        }[color]

        const { text: _betAmount } = await message.question(
            `[id${message.user.vkId}|${message.user.name}], Введите ставку на ${betTeam}`, {
                targetUserId: message.senderId,
                keyboard: depositKeyboard(message.user)
            })

        if (!_betAmount) {
            return message.send("Ты должен ввести cумму")
        }

        let betAmount = _betAmount.replace(/(вб|вабанк)/ig, Number(message.user.balance))

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

        await message.user.save()
        await Rate.create({
            gameId: currentGame.id,
            peerId: message.peerId,
            userVkId: message.senderId,
            username: message.user.name,
            betAmount: betAmount,
            mode: "basketball",
            data: {
                team: color
            }
        })

        message.send(
            `${currentGame.isNewGame ? "Первая ставка" : "Ставка"} ` +
            `${features.split(betAmount)} на ${betTeam} принята!`
        )
    }
}