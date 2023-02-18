import { Keyboard } from "vk-io"

export const adminKeyboard = (user) => {
    const keyboard = Keyboard.builder()

    if (user.is.Developer) {
        keyboard.textButton({
            label: 'Рассылка',
            payload: {
                command: 'mailing'
            },
        })
    }
    keyboard.textButton({
        label: 'Установить префикс',
        payload: {
            command: 'prefixUse'
        },
        color: Keyboard.POSITIVE_COLOR
    })
    keyboard.textButton({
        label: 'Префикс',
        payload: {
            command: 'prefix'
        },
        color: user.is.Prefix ? Keyboard.POSITIVE_COLOR : Keyboard.NEGATIVE_COLOR
    })
    keyboard.row()
    keyboard.textButton({
        label: 'Меню',
    })

    return keyboard
}
