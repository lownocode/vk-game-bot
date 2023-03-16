import { Keyboard } from "vk-io"
import YAML from "yaml"
import fs from "fs"
import axios from "axios"

import { features, formatSum } from "../../utils/index.js"
import { detectDiscount } from "../../functions/index.js"

const config = YAML.parse(
    fs.readFileSync(process.cwd() + "/data/config.yaml", "utf-8")
)

export const buyCoins = {
    access: "private",
    pattern: new RegExp(`^купить ${config.bot.currency}$`, "i"),
    handler: async message => {
        const discounts = Object.keys(config.shopDiscounts)
            .map((key, index) => {
                return index > 0 ? `От ${features.split(key)} ₽ выгода ${config.shopDiscounts[key]}%` : null
            })
            .join("\n")

        const { text: _rubles } = await message.question(
            `🤑 Обратите внимание, у нас есть скидки:\n\n${discounts}\n\n` +
            `Цена за 1 000 000 ${config.bot.currency} — ${config.shopPricePerMillion} ₽\n` +
            `Введите сумму в рублях, на которую вы хотите приобрести ${config.bot.currency}:`
        )

        const rubles = formatSum(_rubles)

        if (!_rubles || isNaN(Number(rubles))) {
            return message.send("Неверно введена сумма, попробуйте снова")
        }

        if (rubles < 1) {
            return message.send(`Минимальная сумма, на которую вы можете приобрести ${config.bot.currency} — 5 ₽`)
        }

        if (rubles > 15_000) {
            return message.send(`Максимальная сумма, на которую вы можете приобрести ${config.bot.currency} — 15 000 ₽`)
        }

        const sum = (rubles * 1_000_000 / config.shopPricePerMillion) + ((rubles * 1_000_000) * (detectDiscount(rubles) / 100))

        return message.send(
            `💡 Вы отдаёте: ${features.split(rubles)} ₽\n` +
            `💰 Вы получите: ${features.split(sum)} ${config.bot.currency}\n\n` +
            `📎 Воспользуйтесь кнопками ниже для оплаты`, {
                keyboard: await payButtons(sum, rubles, message)
            }
        )
    }
}

const payButtons = async (coins, rubles, message) => {
    const keyboard = Keyboard.builder()

    const { status, data: { response: { link: wdonateUrl } } } = await axios.post("https://wdonate.ru/api/getLink", {
        token: config.wdonate.token,
        userId: message.senderId,
        botId: config["vk-group"].id,
        sum: rubles
    })

    if (status === 200) {
        keyboard.urlButton({
            label: "WDonate",
            url: wdonateUrl
        })
    }

    return keyboard.inline()
}