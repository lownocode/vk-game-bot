import { freebieKeyboard } from "../../keyboards/index.js"

export const freebie = {
    access: "private",
    pattern: /^(freebie|халява)$/i,
    handler: message => {
        message.send("Здесь вы можете получить бонусы", { keyboard: freebieKeyboard })
    }
}