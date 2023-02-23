import { ChatRate, Rate } from "../db/models.js"

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

    await ChatRate.create({
        peerId: message.peerId,
        userId: message.user.id,
        betAmount: betAmount,
        mode: message.chat.mode,
        data: data,
        percentOfBetAmount: percentOfBetAmount
    })
    await Rate.create({
        gameId: game.id,
        peerId: message.peerId,
        userVkId: message.user.vkId,
        username: message.user.name,
        betAmount: betAmount,
        mode: message.chat.mode,
        data: data
    })
}