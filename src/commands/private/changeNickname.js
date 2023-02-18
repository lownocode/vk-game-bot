import { privateKeyboard } from "../../keyboards/index.js"

export const changeNickname = {
    access: "private",
    pattern: /^сменить ник(нейм)?$/i,
    handler: async message => {
        if (message.user.winCoins < 10_000_000_000) {
            return message.send('Для смены ника нужно, выиграть не менее 10 000 000 000 за все время', {
                keyboard: privateKeyboard(message.user)
            })
        }

        const { text: _nickname } = await message.question(
            `Введи новое имя (старое будет удалено). Пробелы разрешены (до 3). Максимальная длина 10.`, {
                targetUserId: message.senderId
            })

        const nickname = _nickname.replace(/[^ -\u2122]+ +| *[^ -\u2122]+/ug, '')

        if (nickname.match(/[^\s]/g).length > 11 || nickname.length < 3) {
            return message.send(`Максимальная длина 10 символа в нике ${nickname}, ${nickname.match(/[^\s]/g).length} символов.`, {
                keyboard: privateKeyboard(message.user)
            })
        }

        message.user.name = nickname
        await message.user.save()

        await message.send(`Ты успешно установил ник ${nickname}`, {
            keyboard: privateKeyboard(message.user)
        })
    }
}