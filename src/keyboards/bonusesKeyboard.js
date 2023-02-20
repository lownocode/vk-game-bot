import { Keyboard } from "vk-io"

export const bonusesKeyboard = Keyboard.builder()
    .textButton({
        label: "Дневной бонус"
    })
    .textButton({
        label: "Бонус за подписку",
    })
    .row()
    .textButton({
        label: "Меню",
        color: Keyboard.POSITIVE_COLOR
    })