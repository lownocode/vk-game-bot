import { Keyboard } from "vk-io"

export const modeKeyboard = Keyboard.builder()
    .callbackButton({
        label: 'Кубик',
        payload: {
            command: 'mode_cube'
        },
        color: Keyboard.SECONDARY_COLOR
    })
    .callbackButton({
        label: 'Слоты',
        payload: {
            command: 'mode_slots'
        },
        color: Keyboard.SECONDARY_COLOR
    })
    .row()
    .callbackButton({
        label: 'Double',
        payload: {
            command: 'mode_double'
        },
        color: Keyboard.SECONDARY_COLOR
    })
    .callbackButton({
        label: 'Баскетбол',
        payload: {
            command: 'mode_basketball'
        },
        color: Keyboard.SECONDARY_COLOR
    })
    .callbackButton({
        label: 'Wheel',
        payload: {
            command: 'mode_wheel'
        },
        color: Keyboard.SECONDARY_COLOR
    })
    .row()