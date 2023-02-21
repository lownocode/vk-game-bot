import { config } from "../../main.js"

export const convertChatMode = (mode, idFormat = true) => {
    return String(idFormat
        ? getKeyByValue(config.games.available, capitalizeFirstLetter(mode))
        : config.games.available[mode.toLowerCase()])
}

const getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] === value)
}

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
}