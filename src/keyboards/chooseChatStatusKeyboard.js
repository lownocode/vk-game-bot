import { Keyboard } from "vk-io"

import { config } from "../../main.js"
import { features } from "../utils/index.js"

export const chooseChatStatusKeyboard = () => {
    const keyboard = Keyboard.builder()

    for (const status of config.payedChatsStatuses) {
        keyboard.textButton({
            label: (
                `${status.percent}% со ставок - ` +
                `${features.split(status.cost)} ${config.bot.currency} в день`
            ),
            color: Keyboard.PRIMARY_COLOR,
            payload: {
                command: "chooseChatStatus/" + status.percent
            }
        })

        keyboard.row()
    }

    return keyboard
}