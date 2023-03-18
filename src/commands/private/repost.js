import { config, vkuser } from "../../../main.js"
import { formatSum } from "../../utils/index.js"
import { Wall } from "../../../db/models.js"

export const repost = {
    access: "private",
    pattern: /^(\/repost|\/репост)$/i,
    handler: async message => {
        if (!message.user.isAdmin) return

        if (!message.attachments.length) {
            let { text: wallText } = await message.question(
                `Вы создаёте новый пост с бонусом за репост, в следующем сообщении отправьте текст поста если он нужен, ` +
                `или просто напишите Отмена, если текст в посте не нужен`
            )

            if (/отмена/i.test(wallText)) {
                wallText = null

                message.send("Пост будет создан без текста")
            }

            return await vkuser.api.wall.post({
                owner_id: -config["vk-group"].id,
                from_group: 1,
                attachment: config.repostBonus.picture,
                [wallText && "message"]: wallText
            })
                .then(async ({ post_id }) => {
                    const { text: _time } = await message.question(
                        "Введите время действия бонуса в часах или отправьте 0, если бонус должен быть бессрочным"
                    )

                    const time = formatSum(_time, message)

                    if (typeof time !== "number") {
                        return message.send("Время действия поста указано неверно")
                    }

                    if (time === 0) {
                        await Wall.create({
                            wallId: post_id,
                            type: "repost"
                        })

                        return message.send(
                            `Бессрочный пост с бонусом за репост успешно создан ` +
                            `- vk.com/wall-${config["vk-group"].id}_${post_id}`
                        )
                    }

                    await Wall.create({
                        wallId: post_id,
                        type: "repost",
                        expireAt: Date.now() + (time * 3_600_000)
                    })

                    return message.send(
                        `Пост с бонусом за репост успешно создан - vk.com/wall-${config["vk-group"].id}_${post_id} ` +
                        `и будет действовать ${time} ч.`
                    )
                })
                .catch((e) => {
                    console.log(e)
                    message.send("Произошла ошибка при создании поста, попробуйте позже")
                })
        }

        if (message.attachments[0].ownerId !== -config["vk-group"].id) {
            return message.send(
                "Пост находится не на стене группы из конфига"
            )
        }

        const currentBonus = await Wall.findOne({
            where: {
                type: "repost",
                wallId: message.attachments[0].id
            }
        })

        if (
            currentBonus && currentBonus.expireAt === 0 ||
            currentBonus && Number(currentBonus.expireAt) > Date.now()
        ) {
            return message.send(
                "На этот пост уже прикреплен бонус и он все еще действует"
            )
        }

        const { text: _time } = await message.question(
            "Введите время действия бонуса в часах или отправьте 0, если бонус должен быть бессрочным"
        )

        const time = formatSum(_time, message)

        if (typeof time !== "number") {
            return message.send("Время действия поста указано неверно")
        }

        if (time === 0) {
            await Wall.create({
                wallId: message.attachments[0].id,
                type: "repost",
            })

            return message.reply(
                "Бонус успешно прикреплен на этот пост и будет действовать бессрочно"
            )
        }

        await Wall.create({
            wallId: message.attachments[0].id,
            type: "repost",
            expireAt: Date.now() + (time * 3_600_000)
        })
        await message.reply(
            `Бонус успешно прикреплен на этот пост и будет действовать ${time} ч.`
        )
    }
}