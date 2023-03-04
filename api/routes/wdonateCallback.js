import md5 from "md5"
import Sequelize from "sequelize"

import { config, vk } from "../../main.js"
import { detectDiscount } from "../../src/functions/index.js"
import { User } from "../../db/models.js"
import { logger } from "../../src/logger/logger.js"
import { features } from "../../src/utils/index.js"

export const wdonateCallback = async fastify => fastify.post("/internal/wdonateCallback", async (req, res) => {
    const sign = md5(`${config["vk-group"].id}:${req.body.type}:${req.body.date}:${config.wdonate.token}`)

    if (sign !== req.body.sign) {
        return res.send({
            error: "invalid sign"
        })
    }

    const sum = Math.trunc(Number(req.body.payment.sum))

    if (isNaN(sum) || sum < 1) return

    const coins = (sum * 1000) + ((sum * 1000) * (detectDiscount(sum) / 100))

    await User.update({
        balance: Sequelize.literal(`balance + ${coins}`)
    }, {
        where: {
            vkId: Number(req.body.payment.userId)
        }
    })

    await vk.api.messages.send({
        random_id: 0,
        peer_id: Number(req.body.payment.userId),
        message: `✅ Успешное пополнение ${features.split(coins)} ${config.bot.currency}`
    }).catch((err) => {
        logger.failure(
            `ошибка при пополнении WDonate, userId: ${req.body.payment.userId}\n\n${err}`
        )
    })

    res.send({
        status: "success"
    })
})
