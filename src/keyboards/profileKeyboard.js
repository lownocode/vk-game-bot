import { Keyboard } from "vk-io"

export const profileKeyboard = Keyboard.builder()
    .textButton({
        label: 'Сменить ник',
        payload: {
            command: 'changeOfNickname'
        },
    })
    .row()
    .inline()