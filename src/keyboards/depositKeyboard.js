import { Keyboard } from "vk-io"

import { features } from "../utils/index.js"
import { config } from "../../main.js"

export const depositKeyboard = (user) => {
    const keyboard = Keyboard.builder()

    if (Number(user.balance) < 100_000) {
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
            })
            .row()
            .inline()
    }

    if (amount >= config.bot.max_bet) {
        keyboard
            .textButton({
                label: `${features.split(Math.trunc(config.bot.max_bet / 3))}`,
            })
            .row()
            .textButton({
                label: `${features.split(Math.trunc(config.bot.max_bet / 2))}`,
            })
            .row()
            .textButton({
                label: `${features.split(Math.trunc(config.bot.max_bet))}`,
            })
            .row()
            .inline()
    }

    return keyboard
}