import { Keyboard } from "vk-io"

export const gamesKeyboard = Keyboard.builder()
    .textButton({
        label: 'Мяч',
        payload: {
            command: 'ball'
        },
    })
    .textButton({
        label: 'Нвути',
        payload: {
            command: 'nvuti'
        },
    })
    .row()
    .textButton({
        label: "Кубик",
        payload: {
            command: "cube"
        }
    })
    .row()
    .textButton({
        label: 'Меню',
        payload: {
            command: 'help'
        },
        color: Keyboard.NEGATIVE_COLOR
    })
    .oneTime()