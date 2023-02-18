import { Keyboard } from "vk-io"

export const profileKeyboard = Keyboard.builder()
    .textButton({
        label: 'Сменить ник',
        payload: {
            command: 'changeOfNickname'
        },
    })
    .textButton({
        label: 'Клан',
        payload: {
            command: 'clan'
        },
    })
    .row()
    .inline(true);