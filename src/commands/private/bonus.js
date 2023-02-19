import { features } from "../../utils/index.js"
import { privateKeyboard } from "../../keyboards/index.js"

export const bonus = {
    access: "private",
    pattern: /^(бонус|получить бонус!)$/i,
    handler: async message => {
        if (Number(message.user.bonusReceivedTime) >= Date.now() - 30 * 60 * 1000) {
            return message.send("Бонус можно получить раз в 30 минут.")
        }

        const reward = features.random.integer(50_000, 1_000_000)

        message.user.balance = Number(message.user.balance) + reward
        message.user.bonusReceivedTime = Date.now()
        await message.user.save()

        message.send(`Вы успешно получили бонус в размере: ${features.split(reward)}`, {
            keyboard: privateKeyboard(message.user)
        })
    }
}