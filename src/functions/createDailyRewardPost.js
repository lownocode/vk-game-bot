import fs from "node:fs"
import chunk from "lodash.chunk"

import { vk, vkuser, config } from "../../main.js"
import { logger } from "../logger/logger.js"
import { User } from "../../db/models.js"

export const createDailyRewardPost = async () => {
    let postId = fs.readFileSync(`${process.cwd()}/data/bonusPostId`, "utf-8")

    await vkuser.api.wall.delete({
        owner_id: -config["vk-group"].id,
        post_id: postId
    })
        .then(() => logger.success("last daily reward post has been deleted"))
        .catch(() => logger.failure("failed to delete last daily reward post"))

    await vkuser.api.wall.post({
        owner_id: -config["vk-group"].id,
        from_group: 1,
        attachment: config.repostBonus.picture
    }).then(({ post_id }) => {
        postId = post_id
        fs.writeFileSync(`${process.cwd()}/data/bonusPostId`, post_id.toString(), "utf-8")

        logger.success(`daily reward post has been created - vk.com/wall-${config["vk-group"].id}_${post_id}`)
    })

    await process.nextTick(async () => {
        const users = (await User.findAll({
            attributes: ["vkId"],
            where: {
                newsletter: true
            }
        })).map((user) => user.vkId)

        for (const usersIds of chunk(users, 50)) {
            try {
                await vk.api.messages.send({
                    random_id: 0,
                    user_ids: usersIds.join(","),
                    attachment: `wall-${config["vk-group"].id}_${postId}`,
                    message: "Новый бонус за репост, успей получить!"
                })
            } catch (err) {
                logger.failure("Ошибка при отправке сообщений [createDailyRewardPost]")
            }
        }
    })
}