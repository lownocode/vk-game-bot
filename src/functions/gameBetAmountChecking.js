import { features, formatSum } from "../utils/index.js"
import { config } from "../../main.js"

export const gameBetAmountChecking = (betAmount, message) => {
    if (!betAmount) {
        return message.send("Это не похоже на сумму ставки")
    }

    const _betAmount = formatSum(betAmount, message)

    if (!_betAmount) {
        return message.send("Это не похоже на сумму ставки")
    }

    if (!_betAmount || isNaN(_betAmount) || _betAmount < config.bot.minimumBet) {
        return message.send(`Минимальная ставка - ${features.split(config.bot.minimumBet)} ${config.bot.currency}`)
    }

    if (_betAmount > config.bot.maximumBet) {
        return message.send(`Максимальная ставка - ${features.split(config.bot.maximumBet)} ${config.bot.currency}`)
    }

    if (Number(message.user.balance) < _betAmount) {
        return message.send(`На вашем счету недостаточно средств!`)
    }

    return _betAmount
}