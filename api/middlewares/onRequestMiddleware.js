import { User } from "../../db/models.js"

const PATHS_WITHOUT_TOKEN = [
    "/internal/wdonateCallback"
]

export const onRequestMiddleware = async (req, res) => {
    if (!PATHS_WITHOUT_TOKEN.includes(req.url) && !req.url.startsWith("/api")) {
        return res.status(400).send({
            code: "INVALID_PATH",
            message: "все запросы к API должны начинаться с /api"
        })
    }

    if (!PATHS_WITHOUT_TOKEN.includes(req.url) && !req.headers["token"]) {
        return res.status(400).send({
            code: "BAD_REQEUST",
            message: "каждый запрос должен содержать заголовок token с вашим токеном"
        })
    }

    if (req.headers["token"]) {
        const user = await User.findOne({
            where: { "api.token": req.headers.token }
        })

        if (!user) return res.status(400).send({
            code: "INVALID_TOKEN",
            message: "ваш токен недействителен"
        })

        req.user = user
    }
}