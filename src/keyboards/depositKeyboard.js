import { Keyboard } from "vk-io"

import { features } from "../utils/index.js"
import { config } from "../../main.js"

export const depositKeyboard = (user) => {
    const keyboard = Keyboard.builder()

    if (user.balance + user.bonusBalance < 100000) {
        return
    }

    const sum = user.balance + user.bonusBalance

    if (sum < config.bot.max_bet) {
        keyboard.textButton({
            label: `${features.split(Math.trunc(sum / 3))}`,
        })
        keyboard.row()
        keyboard.textButton({
            label: `${features.split(Math.trunc(sum / 2))}`,
        })
        keyboard.row()
        keyboard.textButton({
            label: `${features.split(Math.trunc(sum))}`,
        })
        keyboard.row()
        keyboard.inline(true);
    }

    if (sum >= config.bot.max_bet) {
        keyboard.textButton({
            label: `${features.split(Math.trunc(config.bot.max_bet / 3))}`,
        })
        keyboard.row()
        keyboard.textButton({
            label: `${features.split(Math.trunc(config.bot.max_bet / 2))}`,
        })
        keyboard.row()
        keyboard.textButton({
            label: `${features.split(Math.trunc(config.bot.max_bet))}`,
        })
        keyboard.row()
        keyboard.inline(true);
    }

    return keyboard
}