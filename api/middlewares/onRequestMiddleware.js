import crypto from "crypto"

import { User } from "../../db/models.js"
import { config } from "../../main.js"

const PATHS_WITHOUT_TOKEN = [
    "/internal/wdonateCallback"
]

export const onRequestMiddleware = async (req, res) => {
    let user = null

    if (
        !PATHS_WITHOUT_TOKEN.includes(req.url) &&
        !req.headers["token"] &&
        req.body?.fromMiniApp
    ) {
        const validSign = crypto
            .createHmac("sha256", config["mini-app"].secretKey)
            .update(req.body.checkString)
            .digest("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=$/g, "")

        if (validSign !== req.body.sign) {
            return res.send({
                code: "INVALID_SIGN",
                message: "baka, senpai"
            })
        }

        const userVkId = req.body.checkString.split("user_id=")[1].split("&")[0]

        user = await User.findOne({
            where: { vkId: Number(userVkId) }
        })
    }

    if (!PATHS_WITHOUT_TOKEN.includes(req.url) && !req.url.startsWith("/api")) {
        return res.status(400).send({
            code: "INVALID_PATH",
            message: "все запросы к API должны начинаться с /api"
        })
    }

    if (
        !PATHS_WITHOUT_TOKEN.includes(req.url) &&
        !req.headers.token &&
        !req.body?.fromMiniApp
    ) {
        return res.status(400).send({
            code: "BAD_REQEUST",
            message: "каждый запрос должен содержать заголовок token с вашим токеном"
        })
    }

    if (req.headers.token) {
        user = await User.findOne({
            where: { "api.token": req.headers.token }
        })
    }

    if (!user && !PATHS_WITHOUT_TOKEN.includes(req.url)) {
        return res.status(400).send({
            code: "INVALID_TOKEN",
            message: "ваш токен недействителен"
        })
    }

    req.user = user
}