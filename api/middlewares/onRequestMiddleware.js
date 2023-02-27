import { User } from "../../src/db/models.js"

export const onRequestMiddleware = async (req, res) => {
    if (!req.url.startsWith("/api")) return res.status(400).send({
        code: "INVALID_PATH",
        message: "все запросы к API должны начинаться с /api"
    })

    if (!req.headers["token"]) return res.status(400).send({
        code: "BAD_REQEUST",
        message: "каждый запрос должен содержать заголовок token с вашим токеном"
    })

    const user = await User.findOne({
        where: { apiToken: req.headers.token }
    })

    if (!user) return res.status(400).send({
        code: "INVALID_TOKEN",
        message: "ваш токен недействителен"
    })

    req.user = user
}