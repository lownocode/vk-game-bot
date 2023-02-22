import { Keyboard } from "vk-io"

export const chatInfoKeyboard = Keyboard.builder()
    .textButton({
        label: "Статистика",
        color: Keyboard.PRIMARY_COLOR,
        payload: {
            command: "chatStatistics"
        }
    })
    .textButton({
        label: "Настройки",
        color: Keyboard.PRIMARY_COLOR,
        payload: {
            command: "chatSettings"
        }
    })
    .inline()