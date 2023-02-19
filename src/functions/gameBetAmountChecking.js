import { features, formatSum } from "../utils/index.js"
import { config } from "../../main.js"

export const gameBetAmountChecking = (betAmount, message) => {
    if (!betAmount) {
        return message.send("Ты должен ввести cумму")
    }


    let _betAmount = betAmount

    _betAmount.replace(/(вб|вабанк)/ig, Number(message.user.balance))
    _betAmount = formatSum(betAmount)

    if (!_betAmount || isNaN(_betAmount) || _betAmount < config.bot.minimumBet) {
        return message.send(`Минимальная ставка - ${features.split(config.bot.minimumBet)}`)
    }

    if (_betAmount > config.bot.max_bet) {
        return message.send(`Максимальная ставка - ${features.split(config.bot.max_bet)}`)
    }

    if (Number(message.user.balance) < _betAmount) {
        return message.send(`На вашем счету недостаточно средств!`)
    }

    return _betAmount
}