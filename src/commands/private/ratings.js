import { ratingsKeyboard } from "../../keyboards/index.js"

export const ratings = {
    access: "private",
    pattern: /^топы$/i,
    handler: message => {
        return message.send("Выберите один из доступных топов", {
            keyboard: ratingsKeyboard
        })
    }
}