import { Keyboard } from "vk-io"

export const ratingsKeyboard = Keyboard.builder()
    .textButton({
        label: "Дневной топ"
    })
    .textButton({
        label: "Постоянный топ"
    })
    .row()
    .textButton({
        label: "Меню",
        color: Keyboard.POSITIVE_COLOR
    })