import { chatsKeyboard } from "../../keyboards/index.js"

export const search = {
    access: "private",
    pattern: /^(найти чат|search chat|найти беседу)$/i,
    handler: async message => {
        message.send("Выберите чат, в который хотели бы присоединиться", {
            keyboard: chatsKeyboard()
        })
    }
}