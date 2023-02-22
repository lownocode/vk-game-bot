import { Keyboard } from "vk-io"
import Sequelize, { Op } from "sequelize"

import { Game, Rate, User, Chat } from "../db/models.js"
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

        if (rates.length >= 1) {
            await gameResults(game, rates)
        } else {
            await game.destroy()
        }
    }

    await sleep(1_000)
    await gamesObserver()
}

const gameResults = async (game, rates) => {
    const results = []

    for (const rate of rates) {
        const user = await User.findOne({ where: { vkId: rate.userVkId } })
        const chat = await Chat.findOne({ where: { peerId: game.peerId } })

        const params = [user, game, rate, results]

        switch (rate.mode) {
            case "slots"     : await slots(...params);      break
            case "dice"      : await dice(...params);       break
            case "double"    : await double(...params);     break
            case "basketball": await basketball(...params); break
            case "wheel"     : await wheel(...params);      break
            case "under7over": await under7over(...params); break
        }

        const profitCoins = Number(chat.profitCoins) + rate.betAmount * Number(chat.status) / 100

        chat.profitCoins = profitCoins

        if (user.vkId !== chat.payer) {
            await User.update({
                balance: Sequelize.literal(
                    `balance + ${profitCoins}`
                )
            }, {
                where: {
                    vkId: chat.payer
                }
            })
        }

        await chat.save()
        await rate.destroy()
    }

    await game.destroy()
    await vk.api.messages.send({
        random_id: 0,
        message: (
            `Итоги раунда:\n\n` +
            `${results.join("\n")}\n\n` +
            `Хеш: ${game.hash}\n` +
            `Проверка: ${game.salt}`
        ),
        peer_id: game.peerId,
        [game.image && "attachment"]: game.image,
        keyboard: Keyboard.builder()
            .applicationButton({
                label: "Проверка честности",
                appId: 7433551,
                hash: game.salt
            }).inline()
    })
}