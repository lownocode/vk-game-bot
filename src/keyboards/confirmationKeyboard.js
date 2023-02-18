import { Keyboard } from "vk-io"

export const confirmationKeyboard = Keyboard.builder()
    .textButton({
        label: 'Да',
        payload: {
            command: 'true'
        },
        color: Keyboard.POSITIVE_COLOR
    })
    .row()
    .textButton({
        label: 'Нет',
        payload: {
            command: 'false'
        },
        color: Keyboard.NEGATIVE_COLOR
    })
    .oneTime()