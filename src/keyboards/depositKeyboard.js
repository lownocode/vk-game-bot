import { Keyboard } from "vk-io"

import { features } from "../utils/index.js"
import { config } from "../../main.js"

export const depositKeyboard = (user, fraction) => {
    if (Number(user.balance) === 0 || Number(user.balance) < config.bot.minimumBet) return

    const keyboard = Keyboard.builder()
    const amount = Number(user.balance)

    keyboard
        .textButton({
            label: `${features.split(Math.trunc(fraction ? amount / (fraction + 4) : amount / 4))}`,
        })
        .row()
        .textButton({
            label: `${features.split(Math.trunc(fraction ? amount / (fraction + 3) : amount / 3))}`,
        })
        .row()
        .textButton({
            label: `${features.split(Math.trunc(fraction ? amount / (fraction + 2) : amount / 2))}`,
        })
        .row()
        .textButton({
            label: `${features.split(Math.trunc(fraction ? amount / fraction : amount))}`,
            color: Keyboard.NEGATIVE_COLOR
        })
        .inline()

    return keyboard
}