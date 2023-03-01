import axios from "axios"

import { User } from "../../db/models.js"

export const setCallback = async fastify => fastify.post("/api/setCallback", async (req, res) => {
    if (
        !req.body ||
        !req.body.url
    ) {
        return res
            .status(400)
            .send({
                code: "BAD_REQUEST",
                message: "некоторые обязательные параметры отсутствуют"
            })
    }

    if (!/https?:\/\/[a-zA-Zа-яА-ЯёЁ0-9\/._:-]{4,100}/.test(req.body.url)) {
        return res
            .status(400)
            .send({
                code: "INVALID_URL",
                message: "ваш url не соответствует шаблону нашего регулярного выражения"
            })
    }

    await axios.post(req.body.url, null, {
        timeout: 5000,
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(async ({ data }) => {
            if (!data || !data.token) {
                return res.status(400).send({
                    code: "BAD_REQUEST",
                    message: "некоторые обязательные параметры отсутствуют"
                })
            }

            const user = await User.findOne({
                attributes: ["id", "api"],
                where: {
                    "api.token": data.token
                }
            })

            if (!user) {
                return res.status(404).send({
                    code: "INVALID_TOKEN",
                    message: "указанный токен недействителен"
                })
            }

            if (user.api.callbackUrl === req.body.url) {
                return res.status(400).send({
                    code: "BAD_REQUEST",
                    message: "у вас уже установлен этот url для callback api, если хотите изменить его - сначала удалите"
                })
            }

            user.api = { ...user.api, callbackUrl: req.body.url }
            await user.save()

            await res.send({
                status: "SUCCESS",
                message: "callback url успешно установлен, теперь все уведомления будут приходить на него"
            })
        })
        .catch(() => {
            res.status(400).send({
                code: "BAD_REQUEST",
                message: "похоже, что ваш сервер не ответил на наш запрос"
            })
        })
})