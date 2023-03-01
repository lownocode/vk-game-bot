import { User } from "../../db/models.js"
import { createTransaction } from "../../src/functions/index.js"

export const sendCoins = async (fastify) => fastify.post("/api/sendCoins", async (req, res) => {
    if (
        !req.body ||
        !req.body.recipient ||
        !req.body.amount
    ) {
        return res
            .status(400)
            .send({
                code: "BAD_REQUEST",
                message: "некоторые обязательные параметры отсутствуют"
            })
    }

    if (
        typeof req.body.amount !== "number" ||
        isNaN(req.body.amount) ||
        req.body.amount < 1
    ) {
        return res
            .status(400)
            .send({
                code: "BAD_REQUEST",
                message: "некорректно введена сумма перевода"
            })
    }

    if (Number(req.user.balance) < Number(req.body.amount)) {
        return res
            .status(400)
            .send({
                code: "LOW_BALANCE",
                message: "у вас недостаточно средств на балансе"
            })
    }

    const recipient = await User.findOne({
        attributes: ["id", "balance", "vkId"],
        where: {
            vkId: req.body.recipient
        }
    })

    if (!recipient) {
        return res
            .status(404)
            .send({
                code: "RECIPIENT_NOT_FOUND",
                message: "пользователя, которому вы хотите совершить перевод не существует"
            })
    }

    if (req.user.id === recipient.id) {
        return res
            .status(401)
            .send({
                code: "CANT_TRANSACTION_TO_YOURSELF",
                message: "нельзя переводить себе, даже если очень сильно захотеть"
            })
    }

    await createTransaction({
        recipient: recipient.vkId,
        sender: req.user.vkId,
        amount: Math.trunc(req.body.amount)
    })

    await res.send({
        code: "SUCCESS",
        message: "успешно переведено"
    })
})