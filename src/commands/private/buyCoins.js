import YAML from "yaml"
import fs from "fs"

import { payok, vkuser } from "../../../main.js"
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
            `Цена за 1 000 ${config.bot.currency} — ${config.shopPricePerThousand} ₽\n` +
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

        const sum = (rubles * 1000) + ((rubles * 1000) * (detectDiscount(rubles) / 100))

        const link = payok.getPaymentLink({
            amount: rubles,
            desc: `Покупка ${features.split(sum)} ${config.bot.currency}`,
            success_url: `https://vk.me/club${config["vk-group"].id}`,
            custom: {
                userId: message.user.id
            },
        })

        const { key } = await vkuser.api.utils.getShortLink({
            private: false,
            url: link.payUrl
        })

        return message.send(
            `💡 Вы отдаёте: ${features.split(rubles)} ₽\n` +
            `💰 Вы получите: ${features.split(sum)} ${config.bot.currency}\n\n` +
            `📎 Ссылка для оплаты: vk.cc/${key}`
        )
    }
}