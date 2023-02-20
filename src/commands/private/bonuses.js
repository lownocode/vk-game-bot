import { bonusesKeyboard } from "../../keyboards/index.js"

export const bonuses = {
    access: "private",
    pattern: /^(bonuses|бонусы)$/i,
    handler: message => {
        message.send("Здесь вы можете получить бонусы", {
            keyboard: bonusesKeyboard
        })
    }
}