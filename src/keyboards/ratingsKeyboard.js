import { Keyboard } from "vk-io"

export const ratingsKeyboard = Keyboard.builder()
    .textButton({
        label: "Дневной топ",
        color: Keyboard.SECONDARY_COLOR
    })
    .textButton({
        label: "Недельный топ",
        color: Keyboard.SECONDARY_COLOR
    })
    .row()
    .textButton({
        label: "Постоянный топ",
        color: Keyboard.SECONDARY_COLOR
    })
    .textButton({
        label: "Топ балансов",
        color: Keyboard.SECONDARY_COLOR
    })
    .inline()