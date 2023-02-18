import { privateKeyboard } from "../../keyboards/index.js"

export const newsletter = {
    access: "private",
    pattern: /^(newsletter|рассылка\s\((?:вкл|выкл)\)?)$/i,
    handler: async message => {
        const isHappy = !message.user.newsletter

        message.user.newsletter = !message.user.newsletter
        await message.user.save()

        await message.send(`${isHappy ? 'Теперь вы подписаны на рассылку' : 'Вы успешно отписались от рассылки.'}`, {
            keyboard: privateKeyboard(message.user)
        })
    }
}