import { privateSettingsKeyboard } from "../../keyboards/index.js"

export const newsletter = {
    access: "private",
    pattern: /^(newsletter|рассылка)$/i,
    handler: async message => {
        const isHappy = !message.user.newsletter

        message.user.newsletter = !message.user.newsletter
        await message.user.save()

        await message.send(`${isHappy ? 'Теперь вы подписаны на рассылку' : 'Вы успешно отписались от рассылки.'}`, {
            keyboard: privateSettingsKeyboard(message.user)
        })
    }
}