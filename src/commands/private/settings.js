import { privateSettingsKeyboard } from "../../keyboards/index.js"

export const settings = {
    access: "private",
    pattern: /^настройки$/i,
    handler: message => {
        message.send("Добро пожаловать в меню настроек", {
            keyboard: privateSettingsKeyboard(message.user)
        })
    }
}