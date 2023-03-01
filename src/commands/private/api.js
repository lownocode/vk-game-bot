import crypto from "crypto"
import md5 from "md5"

export const api = {
    access: "private",
    pattern: /^(\/api|\/апи)(\snew)?$/i,
    handler: async message => {
        if (message.text.includes("new")) {
            const token = md5(
                message.user.id +
                crypto.randomBytes(15).toString("hex") +
                Date.now()
            )

            message.user.api = { ...message.user.api, token: token }
            await message.user.save()

            return await message.send(
                `Ваш новый API token: ${token}`
            )
        }

        if (!message.user.api.token) {
            const token = md5(
                message.user.id +
                crypto.randomBytes(15).toString("hex") +
                Date.now()
            )

            message.user.api = { ...message.user.api, token: token }
            await message.user.save()

            return await message.send(
                `Ваш API token: ${token}`
            )
        }

        return message.send(
            `Ваш API token: ${message.user.api.token}`
        )
    }
}