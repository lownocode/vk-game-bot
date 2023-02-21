import { Keyboard } from "vk-io"
import { config } from "../../main.js"
import { chunkArray } from "../utils/index.js"

export const modeKeyboard = () => {
    const keyboard = Keyboard.builder()

    for (const modes of chunkArray(Object.keys(config.games.available), 3)) {
        for (const mode of modes) {
            keyboard.textButton({
                    label: config.games.available[mode],
                    payload: {
                        command: "chooseChatMode/" + mode
                    }
                })
        }

        keyboard.row()
    }

    return keyboard
}