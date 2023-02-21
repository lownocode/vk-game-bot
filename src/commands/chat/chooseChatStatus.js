import { modeKeyboard } from "../../keyboards/index.js"
import { Chat } from "../../db/models.js"

export const chooseChatStatus = {
    command: "chooseChatStatus",
    pattern: /^$/,
    handler: async (message, data) => {
        if (data !== "free") return message.send("Недоступно!")

        await Chat.update({
            status: "free"
        }, {
            where: {
                peerId: message.peerId
            }
        })

        message.send(`Выбран бесплатный статус, теперь выберите режим`, {
            keyboard: modeKeyboard()
        })
    }
}