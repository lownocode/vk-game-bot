import { Keyboard } from "vk-io"

import { features } from "../utils/index.js"
import { config } from "../../main.js"

export const depositKeyboard = (user) => {
    if (Number(user.balance) === 0 || Number(user.balance) < config.bot.minimumBet) return

    const keyboard = Keyboard.builder()
    const amount = Number(user.balance)

    keyboard
        .textButton({
            label: `${features.split(Math.trunc(amount / 3))}`,
        })
        .row()
        .textButton({
            label: `${features.split(Math.trunc(amount / 2))}`,
        })
        .row()
        .textButton({
            label: `${features.split(Math.trunc(amount))}`,
            color: Keyboard.NEGATIVE_COLOR
        })
        .row()
        .inline()

    return keyboard
}