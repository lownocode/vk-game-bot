import { Op } from "sequelize"

import { Transaction } from "../../db/models.js"

export const transactions = fastify => fastify.post("/api/transactions", async (req, res) => {
    const {
        operation = "all",
        limit = 15,
        offset = 0,
    } = req.body || {}

    if (
        !["in", "out", "all"].includes(operation) ||
        limit < 1 ||
        offset < 0
    ) return res
        .status(400)
        .send({
            code: "BAD_REQUEST",
            message: "некоторые обязательные параметры отсутствуют"
        })

    const operations = {
        in: {
            recipient: req.user.vkId
        },
        out: {
            sender: req.user.vkId
        },
        all: {
            [Op.or]: [
                { recipient: req.user.vkId },
                { sender: req.user.vkId }
            ]
        }
    }[operation]

    const transactions = await Transaction.findAll({
        attributes: ["id", "recipient", "sender", "amount", "createdAt"],
        where: operations,
        limit: limit,
        offset: offset
    }) ?? []

    return res.send(transactions)
})