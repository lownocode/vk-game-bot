// import md5 from "md5"
// import fs from "node:fs"
//
// import { features } from "../utils/index.js"
// import { config, vk } from "../main.js"
// import { getDoubleColor, getRealMultiply, getTypeGoal } from "../functions/index.js"
// import gamesList from "../data/games.json" assert { type: "json" }
//
// const gamesListFilePath = process.cwd() + "/data/games.json"
//
// export class Games {
//     getCurrentGame (chatId) {
//         const game = gamesList.find(game => game.chatId === chatId)
//
//         return game ?? null
//     }
//
//     async getOrCreateGame (chatId) {
//         const game = this.getCurrentGame(chatId)
//
//         if (!game) {
//             const newGame = await this.createGame(chatId)
//
//             gamesList.push(newGame)
//             this.saveGamesList()
//
//             return newGame
//         }
//
//         return game
//     }
//
//     saveGamesList () {
//         fs.writeFileSync(gamesListFilePath, JSON.stringify(gamesList, null, "\t"), "utf-8")
//     }
//
//     async getGameData (chatId) {
//         const users = await usersSchema.find({})
//
//         const usersInGame = []
//         const allRatesInGame = []
//         let bet = 0
//
//         users.forEach((user) => {
//             user.rates.forEach((rate) => {
//                 if (rate.peerId !== chatId) {
//                     return
//                 }
//
//                 const foundUser = usersInGame.find((_user) => _user.uid === user.uid)
//
//                 if (foundUser == null) {
//                     usersInGame.push(user)
//                 }
//
//                 allRatesInGame.push({
//                     rate: rate,
//                     uid: user.uid,
//                     name: user.name,
//                     isPrefix: user.is.Prefix,
//                     prefix: user.prefix
//                 })
//
//                 bet += user.sum
//             })
//         })
//
//         return {
//             users: usersInGame,
//             rates: allRatesInGame,
//             bet: bet
//         }
//     }
//
//     async createGame (chatId) {
//         const chat = await getChatById(chatId)
//
//         if (chat.mode === "slots") {
//             const info = {
//                 string: features.random.string(16),
//                 type: [
//                     Math.floor(features.random.integer(1000, 4999) / 1000),
//                     Math.floor(features.random.integer(1000, 4999) / 1000),
//                     Math.floor(features.random.integer(1000, 4999) / 1000),
//                 ],
//             }
//
//             return {
//                 peerId: chatId,
//                 timer: Date.now() + config.bot.round_time,
//                 info: {
//                     ...info,
//                     salt: `${config.bot.smiles[info.type[0] - 1]}, ${config.bot.smiles[info.type[1] - 1]}, ${config.bot.smiles[info.type[2] - 1]}|${info.string}`,
//                     image: config.bot.infoImage[`w${info.type[0]}_${info.type[1]}_${info.type[2]}`],
//                     md5: md5(`${config.bot.smiles[info.type[0] - 1]}, ${config.bot.smiles[info.type[1] - 1]}, ${config.bot.smiles[info.type[2] - 1]}|${info.string}`)
//                 }
//             }
//         }
//     }
//
//     async getGameResults (game) {
//         const chat = await getChatById(game.peerId)
//         const gameData = await this.getGameData(game.peerId)
//
//         const gameMsg = gameData.rates.map(({ rate, isPrefix, prefix, name }) => {
//             const thisUserGame = gameData.users.find(_user => _user.uid === rate.uid)
//             const rates = []
//
//             if (chat.mode === "slots") {
//                 const thisUserX = game.info.type.filter((k) => k === rate.type)
//
//                 if (thisUserX.length >= rate.x) {
//                     thisUserGame.balance += rate.sum * config.bot.factors[rate.x - 1]
//                     thisUserGame.maxWinDay += rate.sum * config.bot.factors[rate.x - 1]
//                     thisUserGame.maxWin += rate.sum * config.bot.factors[rate.x - 1]
//
//                     rates.push(`✅ ${isPrefix ? `${prefix} ${name}` : `${name}` } - ${features.split(rate.sum)} на x${rate.x} ${config.bot.smiles[rate.type - 1]} (Выиграл: ${features.split(rate.sum * config.bot.factors[rate.x - 1])})`)
//                 }
//
//                 else {
//                     rates.push(`❌ ${isPrefix ? `${prefix} ${name}` : `${name}` }  - ${features.split(rate.sum)} на x${rate.x} ${config.bot.smiles[rate.type - 1]} (поражение)`)
//                 }
//             }
//
//             return rates
//         })[0].join("\n")
//
//         const gameIndex = gamesList.findIndex(_game => _game.info.md5 === game.info.md5)
//
//         if (gameIndex >= 0) {
//             gamesList.splice(gameIndex, 1)
//             this.saveGamesList()
//
//             await vk.api.messages.send({
//                 peer_id: game.peerId,
//                 message: gameMsg,
//                 random_id: 0
//             })
//         }
//     }
//
//     async startObserver () {
//         if (gamesList.length === 0) return
//
//         for (const game of gamesList) {
//             const clazz = new Games()
//
//             if (+new Date() > game.timer) return clazz.getGameResults(game)
//
//             const gameData = await clazz.getGameData(game.peerId)
//
//             console.log(gameData)
//         }
//     }
//
//
// //     start () {
// //         const gamesObserver = () => {
// //             if (gamesList.length === 0) return
// //
// //             gamesList.forEach(async (res) => {
// //                 if (res.timer - 600 > Date.now() || res.timer === 0) return
// //
// //                 res.timer = 0
// //
// //                 let info = await getChatById(res.peerId)
// //                 let thisGameInfo = await this.getGameInfo(info)
// //
// //                 if (thisGameInfo.rates.length === 0) {
// //                     this.update(info)
// //
// //                     return
// //                 }
// //
// //                 let bulk = usersSchema.collection.initializeOrderedBulkOp()
// //
// //                 const gameMsg = thisGameInfo.rates.map((u) => {
// //                     const thisUserGame = thisGameInfo.users.find((usr) => usr.uid === u.uid)
// //                     let thisMsg = ``
// //
// //                     if (info.mode === "slots") {
// //                         const thisUserX = res.info.type.filter((k) => k === u.rate.type)
// //
// //                         if(thisUserX.length >= u.rate.x) {
// //                             thisUserGame.balance += +u.rate.sum * config.bot.factors[u.rate.x - 1]
// //                             thisUserGame.maxWinDay += +u.rate.sum * config.bot.factors[u.rate.x - 1]
// //                             thisUserGame.maxWin += +u.rate.sum * config.bot.factors[u.rate.x - 1]
// //                             thisMsg = `✅ ${u.isPrefix ? `${u.prefix} ${u.name}` : `${u.name}` } - ${features.split(u.rate.sum)} на x${u.rate.x} ${config.bot.smiles[u.rate.type - 1]} (Выиграл: ${features.split(u.rate.sum * config.bot.factors[u.rate.x - 1])})`;
// //                         }
// //
// //                         else {
// //                             thisMsg = `❌ ${u.isPrefix ? `${u.prefix} ${u.name}` : `${u.name}` }  - ${features.split(u.rate.sum)} на x${u.rate.x} ${config.bot.smiles[u.rate.type - 1]} (поражение)`;
// //                         }
// //                     }
// //
// //                     if (info.mode === "cube") {
// //                         if (
// //                             (u.rate.type === "even" && res.info.type % 2 === 0) ||
// //                             (u.rate.type === "noteven" && res.info.type % 2 !== 0)
// //                         ) {
// //                             thisUserGame.balance += +u.rate.sum * 1.8
// //                             thisUserGame.maxWinDay += +u.rate.sum * 1.8
// //                             thisUserGame.maxWin += +u.rate.sum * 1.8
// //
// //                             thisMsg += `✅ ${u.isPrefix ? `${u.prefix} ${u.name}` : `${u.name}` } - ставка ${features.split(u.rate.sum)} на ${config.games.betName[u.rate.type]} выиграла! (+${features.split(u.rate.sum * 1.8)})`
// //                         }
// //
// //                         if (u.rate.number === res.info.type) {
// //                             thisUserGame.balance += +u.rate.sum * 5
// //                             thisUserGame.maxWinDay += +u.rate.sum * 5
// //                             thisUserGame.maxWin += +u.rate.sum * 5
// //
// //                             thisMsg += `✅ ${u.isPrefix ? `${u.prefix} ${u.name}` : `${u.name}` } - ставка ${features.split(u.rate.sum)} на число ${u.rate.number} выиграла! (+${features.split(u.rate.sum * 5)})`
// //                         }
// //
// //                         else {
// //                             thisMsg += `❌ ${u.isPrefix ? `${u.prefix} ${u.name}` : `${u.name}` } - ставка ${features.split(u.rate.sum)} на ${ ( u.rate.type === `number` ? `число ${u.rate.number}` : config.games.betName[u.rate.type]) } проиграла`;
// //                         }
// //                     }
// //
// //                     if (info.mode === "double") {
// //                         const multiply = getRealMultiply(res.info.type)
// //
// //                         if (u.rate.type === multiply) {
// //                             thisUserGame.balance += +u.rate.sum * multiply
// //                             thisUserGame.maxWinDay += +u.rate.sum * multiply
// //                             thisUserGame.maxWin += +u.rate.sum * multiply
// //
// //                             thisMsg += `✅ ${u.isPrefix ? `${u.prefix} ${u.name}` : `${u.name}` }, ${features.split(u.rate.sum)} на ${getDoubleColor(multiply)} цвет (+${features.split(u.rate.sum * multiply)})`
// //                         } else {
// //                             thisMsg += `❌ ${u.isPrefix ? `${u.prefix} ${u.name}` : `${u.name}`}, ${features.split(u.rate.sum)} на ${getDoubleColor(Number(u.rate.type))} цвет (поражение)`
// //                         }
// //                     }
// //
// //                     if (info.mode === "basketball") {
// //                         if(u.rate.type === 'zero' && res.info.type === 'zero') {
// //                             thisUserGame.balance += +u.rate.sum * 14
// //                             thisUserGame.maxWinDay += +u.rate.sum * 14
// //                             thisUserGame.maxWin += +u.rate.sum * 14
// //
// //                             thisMsg += `✅ ${u.isPrefix ? `${u.prefix} ${u.name}` : `${u.name}` } - ставка ${features.split(u.rate.sum)} на 🏀 выиграла! (+${features.split(u.rate.sum * 14)})`
// //                         }
// //
// //                         else if(u.rate.type === res.info.type) {
// //                             thisUserGame.balance += +u.rate.sum * 2
// //                             thisUserGame.maxWinDay += +u.rate.sum * 2
// //                             thisUserGame.maxWin += +u.rate.sum * 2
// //                             thisMsg += `✅ ${u.isPrefix ? `${u.prefix} ${u.name}` : `${u.name}` } - ставка ${features.split(u.rate.sum)} на ${getTypeGoal(u.rate.type)} выиграла! (+${features.split(u.rate.sum * 2)})`
// //                         }
// //
// //                         else {
// //                             thisMsg += `❌ ${u.isPrefix ? `${u.prefix} ${u.name}` : `${u.name}` } - ставка ${features.split(u.rate.sum)} на ${getTypeGoal(u.rate.type)} проиграла`
// //                         }
// //                     }
// //
// //                     if (info.mode === "wheel") {
// //                         if (u.rate.type === "zero" && res.info.type === "zero") {
// //                             thisUserGame.balance += +u.rate.sum * 36
// //                             thisUserGame.maxWinDay += +u.rate.sum * 36
// //                             thisUserGame.maxWin += +u.rate.sum * 36
// //
// //                             thisMsg += `✅ ${u.isPrefix ? `${u.prefix} ${u.name}` : `${u.name}` } - ставка ${features.split(u.rate.sum)} на 0 выиграла! (+${features.split(u.rate.sum * 14)})`
// //                         }
// //
// //                         if (
// //                             (u.rate.type === `even` && res.info.type % 2 === 0) ||
// //                             (u.rate.type === `noteven` && res.info.type % 2 !== 0)
// //                         ) {
// //                             thisUserGame.balance += +u.rate.sum * 2
// //                             thisUserGame.maxWinDay += +u.rate.sum * 2
// //                             thisUserGame.maxWin += +u.rate.sum * 2
// //
// //                             thisMsg += `✅ ${u.isPrefix ? `${u.prefix} ${u.name}` : `${u.name}` } - ставка ${features.split(u.rate.sum)} на ${config.games.betName[u.rate.type]} выиграла! (+${features.split(u.rate.sum * 2)})`
// //                         }
// //
// //                         if (u.rate.number === res.info.type) {
// //                             thisUserGame.balance += +u.rate.sum * 36
// //                             thisUserGame.maxWinDay += +u.rate.sum * 36
// //                             thisUserGame.maxWin += +u.rate.sum * 36
// //
// //                             thisMsg += `✅ ${u.isPrefix ? `${u.prefix} ${u.name}` : `${u.name}` } - ставка ${features.split(u.rate.sum)} на число ${u.rate.number} выиграла! (+${features.split(u.rate.sum * 36)})`;
// //                         }
// //
// //                         else if(u.rate.type === res.info.type) {
// //                             thisUserGame.balance += +u.rate.sum * 2
// //                             thisUserGame.maxWinDay += +u.rate.sum * 2
// //                             thisUserGame.maxWin += +u.rate.sum * 2
// //
// //                             thisMsg += `✅ ${u.isPrefix ? `${u.prefix} ${u.name}` : `${u.name}` } - ставка ${features.split(u.rate.sum)} на ${getTypeGoal(u.rate.type)} выиграла! (+${features.split(u.rate.sum * 2)})`;
// //                         }
// //
// //                         else {
// //                             thisMsg += `❌ ${u.isPrefix ? `${u.prefix} ${u.name}` : `${u.name}` } - ставка ${features.split(u.rate.sum)} на ${getTypeGoal(u.rate.type)} проиграла`;
// //                         }
// //                     }
// //
// //
// //                     bulk
// //                         .find({ uid: thisUserGame.uid })
// //                         .updateOne({ $set: {
// //                                 rates: thisUserGame.rates,
// //                                 balance: thisUserGame.balance,
// //                                 maxWinDay: thisUserGame.maxWinDay,
// //                                 maxWin: thisUserGame.maxWin
// //                             }
// //                         })
// //
// //                     return thisMsg
// //
// //                 }).join('<br>')
// //
// //                 await bulk.execute();
// //
// //                 await vk.api.messages.send({
// //                     peer_id: res.peerId,
// //                     random_id: 0,
// //                     message: `
// // Итоги раунда:
// //
// // ${gameMsg}
// //
// // Хэш игры: ${res.info.md5}
// // Проверка честности: ${res.info.salt}`,
// //                     attachment: res.info.image,
// //                 })
// //
// //                 this.update(info)
// //             })
// //         }
// //
// //         setInterval(gamesObserver, 1000)
// //         logger.success("games observer has been started")
// //     }
//
//     //     getCurrentGameOrCreate (chat) {
// //         const currentGame = this.getCurrentGame(chat)
// //
// //         if (currentGame != null) {
// //             return currentGame
// //         }
// //
// //         const newGame = this.generate(chat)
// //         gamesList.push(newGame)
// //
// //         this.saveGames()
// //
// //         return newGame
// //     }
// //
// //     getCurrentGame (chat) {
// //         return gamesList.find(_chat => _chat.peerId === chat.peerId)
// //     }
// //
// //     update (chat) {
// //         const thisGame = gamesList.findIndex((k) => k.peerId === chat.peerId)
// //
// //         if (thisGame === -1) {
// //             return this.getCurrentGameOrCreate(chat)
// //         }
// //
// //         gamesList[thisGame] = this.generate(chat)
// //         this.saveGames()
// //
// //         return gamesList[thisGame]
// //     }
// //
// //     async getGameInfo (chat) {
// //         const users = await usersSchema.find({})
// //
// //         const usersInGame = []
// //         const allRatesInGame = []
// //         let bet = 0
// //
// //         users.forEach((user) => {
// //             user.rates.forEach((rate) => {
// //                 if (rate.peerId !== chat.peerId) {
// //                     return
// //                 }
// //
// //                 const foundUser = usersInGame.find((_user) => _user.uid === user.uid)
// //
// //                 if (foundUser == null) {
// //                     usersInGame.push(user)
// //                 }
// //
// //                 allRatesInGame.push({
// //                     rate: rate,
// //                     uid: user.uid,
// //                     name: user.name,
// //                     isPrefix: user.is.Prefix,
// //                     prefix: user.prefix
// //                 })
// //
// //                 bet += user.sum
// //             })
// //         })
// //
// //         return {
// //             users: usersInGame,
// //             rates: allRatesInGame,
// //             bet: bet
// //         }
// //     }
// //
// //     generate (chat) {
// //         if (chat.mode === "cube") {
// //             const info = {
// //                 string: features.random.string(16),
// //                 type: Math.floor(features.random.integer(1000, 6999) / 1000),
// //             }
// //
// //             return {
// //                 peerId: chat.peerId,
// //                 timer: Date.now() + 35000,
// //                 info: {
// //                     ...info,
// //                     salt: `${info.type}|${info.string}`,
// //                     image: config.bot.infoImage[`w${info.type}`],
// //                     md5: md5(`${info.type}|${info.string}`)
// //                 }
// //             }
// //         }
// //
// //         if (chat.mode === "slots") {
// //             const info = {
// //                 string: features.random.string(16),
// //                 type: [
// //                     Math.floor(features.random.integer(1000, 4999) / 1000),
// //                     Math.floor(features.random.integer(1000, 4999) / 1000),
// //                     Math.floor(features.random.integer(1000, 4999) / 1000),
// //                 ],
// //             }
// //
// //             return {
// //                 peerId: chat.peerId,
// //                 timer: Date.now() + config.bot.round_time,
// //
// //                 info: {
// //                     ...info,
// //                     salt: `${config.bot.smiles[info.type[0] - 1]}, ${config.bot.smiles[info.type[1] - 1]}, ${config.bot.smiles[info.type[2] - 1]}|${info.string}`,
// //                     image: config.bot.infoImage[`w${info.type[0]}_${info.type[1]}_${info.type[2]}`],
// //                     md5: md5(`${config.bot.smiles[info.type[0] - 1]}, ${config.bot.smiles[info.type[1] - 1]}, ${config.bot.smiles[info.type[2] - 1]}|${info.string}`)
// //                 }
// //             }
// //         }
// //
// //         if (chat.mode === "double") {
// //             const info = {
// //                 string: features.random.string(16),
// //                 type: Math.floor(features.random.integer(0, 53999) / 1000),
// //             }
// //
// //             return {
// //                 peerId: chat.peerId,
// //                 timer: Date.now() + config.bot.round_time,
// //                 info: {
// //                     ...info,
// //                     salt: `${info.type}|${getDoubleColor(getRealMultiply(info.type))}|${info.string}`,
// //                     image: config.bot.images[info.type],
// //                     md5: md5(`${info.type}|${getDoubleColor(getRealMultiply(info.type))}|${info.string}`)
// //                 }
// //             }
// //         }
// //
// //         if (chat.mode === "wheel") {
// //             const info = {
// //                 string: features.random.string(16),
// //                 type: Math.floor(features.random.integer(0, 36999) / 1000),
// //             }
// //
// //             return {
// //                 peerId: chat.peerId,
// //                 timer: Date.now() + config.bot.round_time,
// //                 info: {
// //                     ...info,
// //                     salt: `${info.type}|${getDoubleColor(getRealMultiply(info.type))}|${info.string}`,
// //                     image: config.bot.images[info.type],
// //                     md5: md5(`${info.type}|${getDoubleColor(getRealMultiply(info.type))}|${info.string}`)
// //                 }
// //             }
// //         }
// //
// //         if (chat.mode === "basketball") {
// //             const info = {
// //                 string: features.random.string(16),
// //                 number: features.random.integer(0, 14),
// //             }
// //
// //             return {
// //                 peerId: chat.peerId,
// //                 timer: Date.now() + config.bot.round_time,
// //
// //                 info: {
// //                     ...info,
// //                     salt: `${info.number}|${getTypeGoal(info.number)}|${info.string}`,
// //                     type: getTypeGoal(info.number),
// //                     image: config.bot.infoImage[`basketball_${getTypeGoal(info.number)}`],
// //                     md5: md5(`${info.type}|${info.string}`)
// //                 }
// //             }
// //         }
// //     }
// //
// //     saveGames () {
// //         fs.writeFileSync(gamesListFilePath, JSON.stringify(gamesList, null, "\t"), "utf-8")
// //     }
// }