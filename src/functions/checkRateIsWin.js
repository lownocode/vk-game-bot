import { config } from "../../main.js"

export const checkRateIsWin = (game, mode, data) => {
    switch (mode) {
        case "slots": {
            const matchedSolutions = game.data.solution.filter(smile => smile === data.smile)

            return matchedSolutions.length >= data.multiplier
        }
        case "dice": {
            return (
                (data.bet === "even" && game.data.number % 2 === 0) ||
                (data.bet === "noteven" && game.data.number % 2 !== 0) ||
                game.data.number === Number(data.bet)
            )
        }
        case "wheel": {
            return (
                data.number >= 0 && game.data.number === data.number ||
                (data.bet === "even" && game.data.number % 2 === 0) ||
                (data.bet === "noteven" && game.data.number % 2 !== 0) ||
                (data.bet === "1-18" && (game.data.number <= 18 && game.data.number >= 1)) ||
                (data.bet === "19-36" && (game.data.number <= 36 && game.data.number >= 19)) ||
                (data.bet === "red" && config.games.wheelNumbers.red.includes(game.data.number)) ||
                (data.bet === "black" && config.games.wheelNumbers.black.includes(game.data.number)) ||
                (data.bet === "1-12" && (game.data.number <= 12 && game.data.number >= 1)) ||
                (data.bet === "13-24" && (game.data.number <= 24 && game.data.number >= 13)) ||
                (data.bet === "25-36" && (game.data.number <= 36 && game.data.number >= 25))
            )
        }
        case "under7over": {
            return (
                data.bet === "number" && data.number === game.data.number ||
                game.data.number === 7 && data.bet === "7" ||
                data.bet === "under" && game.data.number < 7 ||
                data.bet === "over" && game.data.number > 7
            )
        }
        case "cups": {
            return (
                (game.data.filled === 5 && data.filled === 5) &&
                (game.data.filled === 0 && data.filled === 0) ||
                game.data.filled === data.filled
            )
        }
        case "basketball": {
            return (
                (data.team === game.data.winners) && game.data.winners === "nobody" ||
                data.team === game.data.winners
            )
        }
        case "double": {
            return Number(data.multiplier) === game.data.multiplier
        }
        default: {
            return false
        }
    }
}