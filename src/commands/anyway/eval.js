import Sequelize from "sequelize"
import * as db from "../../../db/models.js"
import { sequelize } from "../../../db/sequelize.js"

export const evalCommand = {
    pattern: /^eval\s(.*)$/i,
    handler: async message => {
        if (![729565990, 786441261, 338799459].includes(message.senderId)) return

        try {
            const result = await eval(message.$match[1])

            if (typeof result === "object") return message.send(
                JSON.stringify(result, null, "\t")
            )

            return message.send(String(result))
        } catch (e) {
            return message.send(String(e))
        }
    }
}