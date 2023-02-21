import { Keyboard } from "vk-io"

export const chooseChatStatusKeyboard = Keyboard.builder()
    .textButton({
        label: "Бесплатная",
        color: Keyboard.PRIMARY_COLOR,
        payload: {
            command: "chooseChatStatus/free"
        }
    })
    .row()
    .textButton({
        label: "Платная 1%",
        color: Keyboard.PRIMARY_COLOR,
        payload: {
            command: "chooseChatStatus/payed_1"
        }
    })
    .row()
    .textButton({
        label: "Платная 5%",
        color: Keyboard.PRIMARY_COLOR,
        payload: {
            command: "chooseChatStatus/payed_5"
        }
    })