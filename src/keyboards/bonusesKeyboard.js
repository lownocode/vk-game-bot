import { Keyboard } from "vk-io"

export const bonusesKeyboard = Keyboard.builder()
    .textButton({
        label: "Бонус",
        color: Keyboard.SECONDARY_COLOR
    })
    .textButton({
        label: "Бонус за подписку",
        color: Keyboard.SECONDARY_COLOR
    })
    .row()
    .textButton({
        label: "Меню",
    })