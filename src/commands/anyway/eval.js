import { User, Rate, Game, Chat, ChatRate } from "../../db/models.js"

export const evalCommand = {
    pattern: /^eval\s(.*)$/i,
    handler: async message => {
        if (message.senderId !== 729565990) return

        const result = await eval(message.$match[1])

        if (typeof result === "object") return message.send(
            JSON.stringify(result, null, "\t")
        )

        return message.send(result.toString())
    }
}