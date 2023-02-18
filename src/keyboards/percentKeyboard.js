import { Keyboard } from "vk-io"

export const percentKeyboard = Keyboard.builder()
    .textButton({
        label: '10',
        payload: {
            command: '10'
        },
        color: Keyboard.PRIMARY_COLOR
    })
    .textButton({
        label: '20',
        payload: {
            command: '20'
        },
        color: Keyboard.PRIMARY_COLOR
    })
    .textButton({
        label: '30',
        payload: {
            command: '30'
        },
        color: Keyboard.PRIMARY_COLOR
    })
    .row()
    .textButton({
        label: '40',
        payload: {
            command: '50'
        },
        color: Keyboard.PRIMARY_COLOR
    })
    .textButton({
        label: '50',
        payload: {
            command: '50'
        },
        color: Keyboard.PRIMARY_COLOR
    })
    .textButton({
        label: '60',
        payload: {
            command: '60'
        },
        color: Keyboard.PRIMARY_COLOR
    })
    .row()
    .oneTime();