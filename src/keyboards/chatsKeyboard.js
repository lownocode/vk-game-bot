import { Keyboard } from "vk-io"
import { config } from "../main.js"
import { chunkArray } from "../utils/index.js"

export const chatsKeyboard = () => {
    const keyboard = Keyboard.builder()
    const titlesChunks = chunkArray(Object.keys(config.chats), 2)
    const urlsChunks = chunkArray(Object.values(config.chats), 2)

    titlesChunks.forEach((titles, titlesIndex) => {
        titles.forEach((title, index) => {
            keyboard.urlButton({
                label: title,
                url: urlsChunks[titlesIndex][index]
            })
        })

        keyboard.row()
    })

    keyboard.textButton({
        label: "Меню",
        color: Keyboard.POSITIVE_COLOR
    })

    return keyboard
}