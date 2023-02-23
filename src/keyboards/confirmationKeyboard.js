import { Keyboard } from "vk-io"

export const confirmationKeyboard = Keyboard.builder()
    .textButton({
        label: "Да",
        payload: {
            confirm: "yes"
        },
        color: Keyboard.POSITIVE_COLOR
    })
    .textButton({
        label: "Нет",
        payload: {
            confirm: "no"
        },
        color: Keyboard.NEGATIVE_COLOR
    })
    .inline()