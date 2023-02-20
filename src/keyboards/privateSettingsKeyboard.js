import { Keyboard } from "vk-io"

export const privateSettingsKeyboard = (user) => {
    const keyboard = Keyboard.builder()

    keyboard
        .textButton({
            label: "Рассылка",
            color: user.newsletter ? Keyboard.POSITIVE_COLOR : Keyboard.NEGATIVE_COLOR
        })
        .textButton({
            label: "Никнейм",
            color: Keyboard.PRIMARY_COLOR
        })
        .row()
        .textButton({
            label: "Меню",
        })

    return keyboard
}