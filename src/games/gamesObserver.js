import { Op } from "sequelize"

import { Game, Rate, User } from "../db/models.js"
import { sleep } from "../utils/index.js"
import { vk } from "../../main.js"
import {
    basketball,
    dice,
    double,
    slots,
    under7over,
    wheel
} from "./resultsGenerator/index.js"

export const gamesObserver = async () => {
    const endedGames = await Game.findAll({
        where: {
            endedAt: {
                [Op.lt]: Date.now()
            }
        }
    })

    for (const game of endedGames) {
        const rates = await Rate.findAll({
            where: {
                gameId: game.id
            }
        })

        await gameResults(game, rates)
    }

    await sleep(1_000)
    await gamesObserver()
}

const gameResults = async (game, rates) => {
    const results = []

    for (const rate of rates) {
        const user = await User.findOne({ where: { vkId: rate.userVkId } })
        const params = [user, game, rate, results]

        switch (rate.mode) {
            case "slots": {
                await slots(...params)
                await rate.destroy()

                break
            }
            case "dice": {
                await dice(...params)
                await rate.destroy()

                break
            }
            case "double": {
                await double(...params)
                await rate.destroy()

                break
            }
            case "basketball": {
                await basketball(...params)
                await rate.destroy()

                break
            }
            case "wheel": {
                await wheel(...params)
                await rate.destroy()

                break
            }
            case "under7over": {
                await under7over(...params)
                await rate.destroy()

                break
            }
        }
    }

    await game.destroy()
    await vk.api.messages.send({
        random_id: 0,
        message: (
            `Итоги раунда:\n\n` +
            `${results.join("\n")}\n\n` +
            `Хеш игры: ${game.hash}\n` +
            `Проверка честности: ${game.salt}`
        ),
        peer_id: game.peerId,
        [game.image && "attachment"]: game.image
    })
}