import { Chat } from "../../db/models.js"
import { Op } from "sequelize"
import { sleep } from "../utils/index.js"
import { vk } from "../../main.js"
import { chooseChatStatusKeyboard } from "../keyboards/index.js"

export const checkChatOnExpire = async () => {
    const almostExpireChats = await Chat.findAll({
        attributes: ["peerId", "id"],
        where: {
            status: {
                [Op.ne]: "expired"
            },
            payedFor: {
                [Op.lt]: Date.now()
            }
        }
    })

    for (const chat of almostExpireChats) {
        chat.status = "expired"
        chat.payedFor = 0

        await chat.save()
        await vk.api.messages.send({
            random_id: 0,
            peer_id: chat.peerId,
            message: "Ваш чат просрочен. Команды станут доступны только после оплаты статуса чата.",
            keyboard: chooseChatStatusKeyboard()
        })
    }

    await sleep(600_000)
    await checkChatOnExpire()
}