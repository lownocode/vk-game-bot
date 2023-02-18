import { depositKeyboard } from "../../../keyboards/index.js"
import { config } from "../../../main.js"
import { features, formatSum } from "../../../utils/index.js"
import { createNewGame, getCurrentGame } from "../../../games/index.js"
import { Rate } from "../../../db/models.js"

export const slotsBet = {
    command: "bet-slots",
    pattern: /^$/,
    handler: async (message, data) => {
        const multiplier = data.split("_")[0]
        const smile = config.bot.smiles[data.split("_")[1] - 1]

        const currentGame = await getCurrentGame(message.peerId)

        const { text: _betAmount } = await message.question(
            `[id${message.user.vkId}|${message.user.name}], Введите ставку на x${multiplier} ${smile}`, {
            targetUserId: message.senderId,
            keyboard: depositKeyboard(message.user)
        })

        let betAmount = _betAmount.replace(/(вб|вабанк)/ig, message.user.balance + message.user.bonusBalance)

        if (!betAmount) {
            return message.send("Ты должен ввести cумму")
        }

        betAmount = formatSum(betAmount)

        if (!betAmount || isNaN(betAmount) || betAmount < 100000) {
            return message.send('Минимальная ставка - 100 000')
        }

        if (betAmount > config.bot.max_bet) {
            return message.send(`Максимальная ставка - ${features.split(config.bot.max_bet)}`)
        }

        if (message.user.balance + message.user.bonusBalance < betAmount) {
            return message.send(`На вашем счету недостаточно средств!`)
        }

        const createRate = async (gameId) => {
            if (betAmount >= message.user.balance) {
                message.user.bonusBalance -= betAmount - message.user.balance
                message.user.balance = 0
            } else {
                message.user.balance -= betAmount
            }

            await Rate.create({
                gameId: gameId,
                peerId: message.peerId,
                userVkId: message.senderId,
                username: message.user.name,
                betAmount: betAmount,
                mode: "slots",
                data: {
                    multiplier: Number(multiplier),
                    smile: config.bot.smiles.findIndex(_smile => _smile === smile),
                }
            })
        }

        if (currentGame) {
            const _currentGame = await getCurrentGame(message.peerId)

            if (currentGame.hash !== _currentGame.hash) {
                return message.send('Раунд, на который вы ставили закончился.')
            }

            await createRate(currentGame.id)
        }

        if (!currentGame) {
            const newGame = await createNewGame(message.peerId)

            message.send("Наконец-то, первая ставка!")
            await createRate(newGame.id)
        }

        await message.user.save()

        message.send(`Ставка ${features.split(betAmount)} x${multiplier} ${smile} принята!`)
    }
}