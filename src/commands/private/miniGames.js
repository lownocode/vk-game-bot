import { gamesKeyboard } from "../../keyboards/index.js"

export const miniGames = {
    access: "private",
    pattern: /^(mini(?:\s|-)games|мини(?:\s|-)игры)$/i,
    handler: message => {
        message.send("Для выбора игры используй клавиатуру", {
            keyboard: gamesKeyboard
        })
    }
}