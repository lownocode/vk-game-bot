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
        label: "Режим",
        color: Keyboard.PRIMARY_COLOR,
        payload: {
            command: "chatSettings/mode"
        }
    })
    .row()
    .textButton({
        label: "Таймер",
        color: Keyboard.PRIMARY_COLOR,
        payload: {
            command: "chatSettings/timer"
        }
    })
    .inline()