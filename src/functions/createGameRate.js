import Sequelize from "sequelize"

import { ChatRate, Rate, User } from "../../db/models.js"
import { getRateMultiplier } from "./getRateMultiplier.js"
import { logger } from "../logger/logger.js"
import { features } from "../utils/index.js"

export const createGameRate = async ({ game, message, betAmount, data }) => {
    const similarRate = await Rate.findOne({
        where: {
            gameId: game.id,
            userVkId: message.senderId,
            data: data,
            mode: message.chat.mode
        }
    })

    if (similarRate) {
        return await Rate.update({
            betAmount: Number(similarRate.betAmount) + betAmount
        }, {
            where: {
                id: similarRate.id
            }
        })
    }

    const percentOfBetAmount = Math.trunc(betAmount * Number(message.chat.status) / 100)

    logger.success(
        `Создана новая ставка\n` +
        `User: ${message.user.vkId}\n` +
        `Amount: ${features.split(betAmount)}\n` +
        "________________________"
    )

    const rate = await Rate.create({
        gameId: game.id,
        peerId: message.peerId,
        userVkId: message.user.vkId,
        username: message.user.name,
        betAmount: betAmount,
        mode: message.chat.mode,
        data: data,
    })
    await ChatRate.create({
        peerId: message.peerId,
        userId: message.user.id,
        betAmount: betAmount,
        mode: message.chat.mode,
        data: data,
        percentOfBetAmount: percentOfBetAmount,
        rateId: rate.id,
        multiplier: Number(getRateMultiplier(message.chat.mode, data, game)),
        gameId: game.id,
    })

    if (message.user.referrer) {
        const profit = Math.trunc(betAmount / 100 * 0.15)

        await User.update({
            balance: Sequelize.literal(`balance + ${profit}`),
            referralsProfit: Sequelize.literal(`"referralsProfit" + ${profit}`)
        }, {
            where: {
                vkId: message.user.referrer
            }
        })
    }
}