import { config } from "../../main.js"

export const getRateMultiplier = (mode, data, game) => {
    const multipliers = config.games.multipliers

    switch (mode) {
        case "wheel": {
            if (data.bet === "number") return multipliers.wheel.number
            if (["even", "noteven", "red", "black", "1-18", "19-36"].includes(data.bet)) return multipliers.wheel.parity
            if (["1-12", "13-24", "25-36"].includes(data.bet)) return multipliers.wheel.interval

            break
        }
        case "slots": {
            return multipliers.slots[data.multiplier - 1]
        }
        case "dice": {
            if (
                (data.bet === "even" && game.data.number % 2 === 0) ||
                (data.bet === "noteven" && game.data.number % 2 !== 0)
            ) return multipliers.dice.parity

            if (game.data.number === Number(data.bet)) return multipliers.dice.number

            break
        }
        case "basketball": {
            if (data.team === game.data.winners) {
                return multipliers.basketball[data.team]
            }

            break
        }
        case "cups": {
            if (
                (game.data.filled === 5 && data.filled === 5) &&
                (game.data.filled === 0 && data.filled === 0) ||
                game.data.filled === data.filled
            ) return multipliers.cups[data.filled]

            break
        }
        case "double": {
            return data.multiplier
        }
        case "under7over": {
            if (data.bet === "number" && data.number === game.data.number) {
                return multipliers.under7over[game.data.number]
            }
            if (game.data.number === 7 && data.bet === "7") {
                return multipliers.under7over["7"]
            }
            if (
                data.bet === "under" && game.data.number < 7 ||
                data.bet === "over" && game.data.number > 7
            ) return multipliers.under7over.underOver

            break
        }
        case "crash": {
            return game.data.point
        }
    }
}