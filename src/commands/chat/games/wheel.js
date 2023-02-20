import { config } from "../../../../main.js"
import { features } from "../../../utils/index.js"
import { depositKeyboard } from "../../../keyboards/index.js"

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

        const colorTitle = {
            red: "красное",
            black: "чёрное"
        }

        let betAmount = 0

        if (data === "red" || data === "black") {
            const { text: _betAmount } = await message.question(
                `[id${message.user.vkId}|${message.user.name}], Введите ставку на ${colorTitle[data]}`, {
                    targetUserId: message.senderId,
                    keyboard: depositKeyboard(message.user)
                })
        }


    }
}

const gameBetAmountChecking = (amount, message) => {

}