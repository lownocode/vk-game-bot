import { User } from "../../../db/models.js"
import { chunkArray, features } from "../../utils/index.js"
import { confirmationKeyboard } from "../../keyboards/index.js"
import { vk } from "../../../main.js"

export const sendNewsletter = {
    access: "private",
    pattern: /^\/рассылка$/i,
    handler: async message => {
        if (!message.user.isAdmin) return

        let attachment = null
        let text = null

        if (message.attachments.length) {
            attachment = `wall${message.attachments[0].ownerId}_${message.attachments[0].id}`
            message.send("Этот пост будет прикреплен к рассылке")
        }

        const { text: _text } = await message.question(
            "Введите текст рассылки в следующем сообщении, или напишите отмена, если он не нужен"
        )

        text = _text

        if (!_text || /отмена/i.test(_text)) {
            text = null
            message.send(
                "Текст не будет прикреплен к рассылке"
            )
        }

        const users = await User.findAll({
            attributes: ["vkId"],
            where: {
                newsletter: true
            }
        })

        const { payload } = await message.question(
            `Всего в рассылке участвует ${features.split(users.length)} чел.\n` +
            "Вы действительно хотите начать рассылку?", {
                keyboard: confirmationKeyboard
            }
        )

        if (!payload || payload.confirm === "no") {
            return message.reply("Рассылка отменена")
        }

        if (payload.confirm === "yes") {
            message.reply("Рассылка начата, ожидайте")

            const send = new Promise(async resolve => {
                process.nextTick(async () => {
                    const uids = users.map((user) => user.vkId)

                    for (const usersIds of chunkArray(uids, 50)) {
                        try {
                            await vk.api.messages.send({
                                random_id: 0,
                                user_ids: usersIds.join(","),
                                [attachment && "attachment"]: attachment,
                                [text && "message"]: text
                            })
                        } catch (err) {
                            message.send("Ошибка при отправке сообщение из чанка с пользователями ", usersIds)
                        }
                    }

                    await resolve()
                })
            })


            Promise.all([send]).finally(() => {
                message.reply("Рассылка успешно завершена")
            })
        }
    }
}