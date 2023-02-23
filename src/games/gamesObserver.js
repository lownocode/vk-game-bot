import { Keyboard } from "vk-io"
import Sequelize, { Op } from "sequelize"

import { Game, Rate, User, Chat } from "../db/models.js"
import { sleep } from "../utils/index.js"
import {vk, vkuser} from "../../main.js"
import {
    basketball,
    dice,
    double,
    slots,
    under7over,
    wheel
} from "./resultsGenerator/index.js"
import {wheelImage} from "./imagesGenerator/index.js";

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

        if (user.vkId !== chat.payer) {
            await User.update({
                balance: Sequelize.literal(
                    `balance + ${Number(rate.percentOfBetAmount)}`
                )
            }, {
                where: {
                    vkId: chat.payer
                }
            })
        }

        await rate.destroy()
        await chat.save()
    }

    await vk.api.messages.send({
        peer_id: game.peerId,
        random_id: 0,
        message: "Итак, итоги раунда..."
    })

    const image = await getGameImage(game.mode, game.data)

    const attachment =
        image ? await vk.upload.messagePhoto({
            source: {
                value: image
            }
        }) : game.image

    await vk.api.messages.send({
        random_id: 0,
        message: (
            `Итоги раунда:\n\n` +
            `${results.join("\n")}\n\n` +
            `Хеш: ${game.hash}\n` +
            `Проверка: ${game.salt}`
        ),
        peer_id: game.peerId,
        [(image || game.image) && "attachment"]: attachment,
        keyboard: Keyboard.builder()
            .applicationButton({
                label: "Проверка честности",
                appId: 7433551,
                hash: game.salt
            }).inline()
    })
    await game.destroy()
}

const getGameImage = async (mode, data) => {
    switch (mode) {
        case "wheel": return await wheelImage(data.number)
        default: return null
    }
}