import { Keyboard } from "vk-io"

export const clanKeyboard = (user, clan) => {
    const keyboard = Keyboard.builder()

    keyboard.textButton({
        label: `${clan ? 'Удалить клан' : 'Создать клан'}`,
        color: clan ? Keyboard.NEGATIVE_COLOR : Keyboard.POSITIVE_COLOR
    })
    if(user.clan.is && clan) {
        keyboard.textButton({
            label: `Информация о клане.`,
            color: Keyboard.POSITIVE_COLOR
        })
    }
    keyboard.oneTime()

    return keyboard
}