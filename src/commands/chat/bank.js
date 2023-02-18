import { getCurrentGame } from "../../games/index.js"
import { Rate } from "../../db/models.js"
import { features } from "../../utils/index.js"
import { config } from "../../../main.js"
import { modeKeyboard } from "../../keyboards/index.js"

export const bank = {
    access: "chat",
    pattern: /^(bank|банк)$/i,
    handler: async message => {
        const currentGame = await getCurrentGame(message.chat.peerId)

        if (!currentGame) {
            return message.send(
                "На данный момент банк пуст, самое время сделать первую ставку!"
            )
        }

        const rates = await Rate.findAll({ where: { gameId: currentGame.id } })

        switch (message.chat.mode) {
            case "slots": {
                const text = rates.map((rate) => {
                    return `[id${rate.userVkId}|${rate.username}] - ${features.split(rate.betAmount)} на x${rate.data.multiplier} ${config.bot.smiles[rate.data.smile]}`
                })

                return message.send(
                    `Ставки на текущую игру:\n\n` +
                    `${text.join("\n")}\n\n` +
                    `Общая сумма ставок: ${features.split(rates.reduce((acc, cur) => acc + cur.betAmount, 0))}\n` +
                    `До конца раунда: ${Math.floor((currentGame.endedAt - Date.now()) / 1000)} сек.\n` +
                    `Хэш игры: ${currentGame.hash}`
                )
            }
            case "cube":
            case "double":
            case "basketball":
            case "wheel": {
                return message.send("Этот режим находится в разработке")
            }
            default: {
                return message.send("Данного режима не существует, попробуйте выбрать один из существующих", {
                    keyboard: modeKeyboard
                })
            }
        }



//         if(info === 'cube') {
//
//             const ratesInGame = thisGameInfo.rates.map((res) => {
//                 return `${res.isPrefix ? `${res.prefix} [id${res.uid}|${res.name}]` : `[id${res.uid}|${res.name}]` } - ${features.split(res.rate.sum)} на ${ ( res.rate.type == `number` ? `число ${res.rate.number}` : config.games.betName[res.rate.type]) }`;
//             }).join('<br>');
//
//             message.send(`
// ${thisGameInfo.rates.length === 0 ? `В этом раунде никто еще не поставил` : `Текущий банк: ${features.split(thisGameInfo.sum)}
//
// Ставки на текущую игру:
// ${ratesInGame}`}
//
// До конца раунда: ${Math.floor((thisGame.timer - Date.now()) / 1000)} сек.
// Хэш игры: ${thisGame.info.md5}`, { keyboard: chatMainKeyboard(message.chat.mode) });
//         }

//         if(info == 'double') {
//             let x2bets = ''
//             thisGameInfo.rates.filter(info => info.rate.type == 2).forEach((item, index) => {
//                 x2bets += `${item.isPrefix ? `${item.prefix} [id${item.uid}|${item.name}]` : `[id${item.uid}|${item.name}]` } - ${utils.split(item.rate.sum)} (Ставка на Х2)`
//             })
//             let x3bets = ''
//             thisGameInfo.rates.filter(info => info.rate.type == 3).forEach((item, index) => {
//                 x3bets += `${item.isPrefix ? `${item.prefix} [id${item.uid}|${item.name}]` : `[id${item.uid}|${item.name}]` } - ${utils.split(item.rate.sum)} (Ставка на Х3)`
//             })
//             let x5bets = ''
//             thisGameInfo.rates.filter(info => info.rate.type == 5).forEach((item, index) => {
//                 x5bets += `${item.isPrefix ? `${item.prefix} [id${item.uid}|${item.name}]` : `[id${item.uid}|${item.name}]` } - ${utils.split(item.rate.sum)} (Ставка на Х5)`
//             })
//             let x50bets = ''
//             thisGameInfo.rates.filter(info => info.rate.type == 50).forEach((item, index) => {
//                 x50bets += `${item.isPrefix ? `${item.prefix} [id${item.uid}|${item.name}]` : `[id${item.uid}|${item.name}]` } - ${utils.split(item.rate.sum)} (Ставка на Х50)`
//             })
//
//             context.send(`
// ${thisGameInfo.rates.length == 0 ? `В этом раунде никто еще не поставил` : `Текущий банк: ${utils.split(thisGameInfo.sum)}
//
// 🤤 До конца игры ${Math.floor((thisGame.timer - Date.now()) / 1000) } сек.
// ${x2bets || ''}
// ${x3bets || ''}
// ${x5bets || ''}
// ${x50bets || ''}
// `}
//
// Хэш игры: ${thisGame.info.md5}`, { keyboard: chatMainKeyboard(thisChat.mode) });
//         }
//
//         if(info == 'basketball') {
//             let red = ''
//             thisGameInfo.rates.filter(info => info.rate.type == 'red').forEach((item, index) => {
//                 red += `\n${item.isPrefix ? `${item.prefix} [id${item.uid}|${item.name}]` : `[id${item.uid}|${item.name}]` } - ${utils.split(item.rate.sum)} EC`
//             })
//             let zero = ''
//             thisGameInfo.rates.filter(info => info.rate.type == 'zero').forEach((item, index) => {
//                 zero += `\n${item.isPrefix ? `${item.prefix} [id${item.uid}|${item.name}]` : `[id${item.uid}|${item.name}]` } - ${utils.split(item.rate.sum)} EC`
//             })
//             let black = ''
//             thisGameInfo.rates.filter(info => info.rate.type == 'black').forEach((item, index) => {
//                 black += `\n${item.isPrefix ? `${item.prefix} [id${item.uid}|${item.name}]` : `[id${item.uid}|${item.name}]` } - ${utils.split(item.rate.sum)} EC`
//             })
//
//             context.send(`
// ${thisGameInfo.rates.length == 0 ? `В этом раунде никто еще не поставил` : `Текущий банк: ${utils.split(thisGameInfo.sum)}
// Всего ставок: ${thisGameInfo.rates.length}
//
// Прогнозы на ${SYMBOL.RED} "Красная": ${red}
// Прогнозы на ${SYMBOL.ZERO} "Ничья": ${zero}
// Прогнозы на ${SYMBOL.BLACK} "Чёрная": ${black}
// `}
//
// До конца раунда: ${Math.floor((thisGame.timer - Date.now()) / 1000)} сек.
// Хэш игры: ${thisGame.info.md5}`, { keyboard: chatMainKeyboard(thisChat.mode) });
//         }
    }
}