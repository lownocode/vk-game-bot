import { Keyboard } from "vk-io"
import YAML from "yaml"
import fs from "fs"

const config = YAML.parse(
    fs.readFileSync(process.cwd() + "/data/config.yaml", "utf-8")
)

export const privateKeyboard = Keyboard.builder()
    .textButton({
        label: "Найти беседу",
        color: Keyboard.PRIMARY_COLOR
    })
    .textButton({
        label: "Профиль",
        color: Keyboard.PRIMARY_COLOR
    })
    .row()
    .textButton({
        label: "Бонусы"
    })
    .textButton({
        label: `Купить ${config.bot.currency}`,
        color: Keyboard.PRIMARY_COLOR
    })
    .textButton({
        label: "Топы"
    })
    .row()
    .textButton({
        label: "Настройки"
    })
    .row()