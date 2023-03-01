export const delCallback = async fastify => fastify.post("/api/delCallback", async (req, res) => {
    if (!req.user.api.callbackUrl) {
        return res.status(404).send({
            code: "CALLBACK_URL_NOT_FOUND",
            message: "у вас и так нет установленного callback url"
        })
    }

    req.user.api = { ...req.user.api, callbackUrl: null }
    await req.user.save()

    await res.send({
        status: "SUCCESS",
        message: "установленный callback url успешно удален"
    })
})