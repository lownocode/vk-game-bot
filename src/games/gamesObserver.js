import { Keyboard } from "vk-io"
import Sequelize, { Op } from "sequelize"

import { Game, Rate, User, Chat } from "../db/models.js"
import { sleep } from "../utils/index.js"
import { config, vk } from "../../main.js"
import {
    basketball,
    cups,
    dice,
    double,
    slots,
    under7over,
    wheel
} from "./resultsGenerator/index.js"
import {
    basketballImage, cupsImage,
    diceImage,
    doubleImage,
    slotsImage,
    under7overImage,
    wheelImage
} from "./imagesGenerator/index.js"
import {chatMainKeyboard} from "../keyboards/index.js";

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
            case "cups"      : await cups(...params); break
        }

        if (user.vkId !== chat.payer) {
            const percentOfBetAmount = Math.trunc(rate.betAmount * Number(chat.status) / 100)

            await User.update({
                balance: Sequelize.literal(
                    `balance + ${percentOfBetAmount}`
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
        message: "Итак, итоги игры..."
    })

    const image = await getGameImage(game.mode, game.data)

    const attachment =
        image ? await vk.upload.messagePhoto({
            source: {
                value: image
            }
        }) : null

    await vk.api.messages.send({
        random_id: 0,
        message: (
            `${getGameResultText(game)}\n\n` +
            `${results.join("\n")}\n\n` +
            `Хеш: ${game.hash}\n` +
            `Проверка: ${game.salt}`
        ),
        peer_id: game.peerId,
        [image && "attachment"]: attachment,
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
        case "wheel": return await wheelImage(data)
        case "slots": return await slotsImage(data)
        case "under7over": return await under7overImage(data)
        case "dice": return await diceImage(data)
        case "double": return await doubleImage(data)
        case "basketball": return await basketballImage(data)
        case "cups": return await  cupsImage(data)
    }
}

const getGameResultText = (game) => {
    switch (game.mode) {
        case "wheel": return (
            `Выпало число ${game.data.number}, ` +
            `${game.data.number === 0 ? "зелёное" :  config.games.wheelNumbers.red.includes(game.data.number) ? "красное" : "чёрное"}!`
        )
        case "slots": return (
            `Выпало ${config.games.slotsSmiles[game.data.solution[0]]}` +
            `${config.games.slotsSmiles[game.data.solution[1]]}` +
            `${config.games.slotsSmiles[game.data.solution[2]]}!`
        )
        case "under7over": return (
            `Выпало ${game.data.number} (Кубики ${game.data.leftDiceSum} и ${game.data.rightDiceSum})!`
        )
        case "basketball": return (
            game.data.winners === "nobody" ? "Победила дружба - ничья!" :
            game.data.winners === "red"
                ? `Победили красные, со счётом ${game.data.score} : 0!`
                : `Победили синие, со счётом ${game.data.score} : 0!`
        )
        case "double": return `Выпало x${game.data.multiplier}!`
        case "dice": return `Выпало число ${game.data.number}!`
        case "cups": return `Выпало ${game.data.filled}!`
    }
}