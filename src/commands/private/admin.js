import { adminKeyboard } from "../../keyboards/index.js"

export const admin = {
    access: "private",
    pattern: /^(admin|админ|админка)$/i,
    handler: async message => {
        if (!message.user.isAdmin) return

        message.send("Используйте клавиатуру", {
            keyboard: adminKeyboard(message.user)
        })
    }
}