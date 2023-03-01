import axios from "axios"
import md5 from "md5"

import { Transaction, User } from "../../db/models.js"
import { config, vk } from "../../main.js"
import { features } from "../utils/index.js"

export const createTransaction = async ({ recipient, sender, amount }) => {
    const transaction = await Transaction.create({
        recipient: recipient,
        sender: sender,
        amount: Math.trunc(amount)
    })

    const senderUser = await User.findOne({
        attributes: ["id", "balance", "name", "vkId"],
        where: { vkId: sender }
    })

    const recipientUser = await User.findOne({
        attributes: ["id", "balance", "api"],
        where: { vkId: recipient }
    })

    if (recipientUser.api.callbackUrl !== null) {
        const sign = md5(
            `${transaction.id}:` +
            `${transaction.sender}:` +
            `${transaction.recipient}:` +
            `${transaction.amount}:` +
            `${convertDate(transaction.createdAt)}:` +
            `${recipientUser.api.token}`
        )

        await axios.post(recipientUser.api.callbackUrl, {
            id: transaction.id,
            sender: transaction.sender,
            recipient: transaction.recipient,
            amount: transaction.amount,
            date: convertDate(transaction.createdAt),
            sign: sign
        }, {
            timeout: 5000,
            headers: {
                "Content-Type": "application/json"
            }
        })
    }

    senderUser.balance = Number(senderUser.balance) - Math.trunc(amount)
    recipientUser.balance = Number(recipientUser.balance) + Math.trunc(amount)

    await senderUser.save()
    await recipientUser.save()

    await vk.api.messages.send({
        peer_id: recipient,
        random_id: 0,
        message: (
            `Вы получили ${features.split(amount)} ${config.bot.currency} ` +
            `от [id${senderUser.vkId}|${senderUser.name}]`
        )
    }).catch((err) => console.log("err with send coins", err))
}

const convertDate = (str) => {
    const date = new Date(str)

    const year = date.getFullYear()
    const month = (date.getMonth() + 1) < 10 ? `0${(date.getMonth() + 1)}` : (date.getMonth() + 1)
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
    const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}