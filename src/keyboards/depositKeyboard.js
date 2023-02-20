import { Keyboard } from "vk-io"

import { features } from "../utils/index.js"
import { config } from "../../main.js"

export const depositKeyboard = (user) => {
    const keyboard = Keyboard.builder()

    if (Number(user.balance) < config.bot.minimumBet) {
        return
    }

    const amount = Number(user.balance)

    if (amount < config.bot.max_bet) {
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
    }

    return keyboard
}