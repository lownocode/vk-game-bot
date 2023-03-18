import { config, vkuser } from "../../../main.js"
import { formatSum } from "../../utils/index.js"
import { Wall } from "../../../db/models.js"

export const fortune = {
    access: "private",
    pattern: /^(\/fortune|\/фортуна)$/i,
    handler: async message => {
        if (!message.user.isAdmin) return

        if (!message.attachments.length) {
            let { text: wallText } = await message.question(
                `Вы создаёте новый пост с фортуной, в следующем сообщении отправьте текст поста если он нужен, ` +
                `или просто напишите Отмена, если текст в посте не нужен`
            )

            if (/отмена/i.test(wallText)) {
                wallText = null

                message.send("Пост будет создан без текста")
            }

            return await vkuser.api.wall.post({
                owner_id: -config["vk-group"].id,
                from_group: 1,
                attachment: config.fortuneBonus.picture,
                [wallText && "message"]: wallText
            })
                .then(async ({ post_id }) => {
                    const { text: _time } = await message.question(
                        "Введите время действия фортуны в часах или отправьте 0, если фортуна должна быть бессрочной"
                    )

                    const time = formatSum(_time, message)

                    if (typeof time !== "number") {
                        return message.send("Время действия поста указано неверно")
                    }

                    if (time === 0) {
                        await Wall.create({
                            wallId: post_id,
                            type: "fortune"
                        })

                        return message.send(
                            `Бессрочный пост с фортуной успешно создан - vk.com/wall-${config["vk-group"].id}_${post_id} `
                        )
                    }

                    await Wall.create({
                        wallId: post_id,
                        type: "fortune",
                        expireAt: Date.now() + (time * 3_600_000)
                    })

                    return message.send(
                        `Пост с фортуной успешно создан - vk.com/wall-${config["vk-group"].id}_${post_id} ` +
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

        const currentFortune = await Wall.findOne({
            where: {
                type: "fortune",
                wallId: message.attachments[0].id
            }
        })

        if (
            currentFortune && currentFortune.expireAt === 0 ||
            currentFortune && Number(currentFortune.expireAt) > Date.now()
        ) {
            return message.send(
                "На этот пост уже прикреплена фортуна и она все еще действует"
            )
        }

        const { text: _time } = await message.question(
            "Введите время действия фортуны в часах или отправьте 0, если фортуна должна быть бессрочной"
        )

        const time = formatSum(_time, message)

        if (typeof time !== "number") {
            return message.send("Время действия поста указано неверно")
        }

        if (time === 0) {
            await Wall.create({
                wallId: message.attachments[0].id,
                type: "fortune",
            })

            return message.reply(
                "Фортуна успешно прикреплена на этот пост и будет действовать бессрочно"
            )
        }

        await Wall.create({
            wallId: message.attachments[0].id,
            type: "fortune",
            expireAt: Date.now() + (time * 3_600_000)
        })
        await message.reply(
            `Фортуна успешно прикреплена на этот пост и будет действовать ${time} ч.`
        )
    }
}