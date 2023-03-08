import { features, formatSum } from "../utils/index.js"
import { config } from "../../main.js"
import {onMessageMiddleware} from "../middlewares/index.js";

export const gameBetAmountChecking = (betAmount, message) => {
    if (!betAmount) {
        return message.send("Это не похоже на сумму ставки")
    }

    let _betAmount = betAmount.replace(/^\[club(\d+)\|(.*)]/i, "")

    _betAmount.replace(/(вб|вабанк)/ig, Number(message.user.balance))

    if (isNaN(Number(_betAmount.replace(/[kк\s]/gi, "")))) {
        return message.send("Это не похоже на сумму ставки")
    }

    _betAmount = formatSum(betAmount)

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