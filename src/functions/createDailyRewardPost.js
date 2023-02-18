import fs from "node:fs"
import chunk from "lodash.chunk"

import { vk, vkuser, config } from "../main.js"
import { features } from "../utils/index.js"
import { logger } from "../logger/logger.js"

export const createDailyRewardPost = async () => {
    let postId = fs.readFileSync(`${process.cwd()}/data/bonusPostId`, "utf-8")

    await vkuser.api.wall.delete({
        owner_id: -config["vk-group"].id,
        post_id: postId
    })
        .then(() => logger.success("last daily reward post has been deleted"))
        .catch(() => logger.failure("failed to delete last daily reward post"))

    vkuser.api.wall.post({
        owner_id: -config["vk-group"].id,
        from_group: 1,
        attachment: config.bonus.picture
    }).then(({ post_id }) => {
        postId = post_id
        fs.writeFileSync(`${process.cwd()}/data/bonusPostId`, post_id.toString(), "utf-8")

        logger.success(`daily reward post has been created - vk.com/wall-${config["vk-group"].id}_${post_id}`)
    })

    process.nextTick(async () => {
        const users = await usersSchema.find({ "is.Developer": { $eq: false } })
        const peerIds = users.map(item => item.uid)

        let sentToUsers = 0
        for (const userIds of chunk(peerIds, 50)) {
            try {
                await vk.api.messages.send({
                    user_ids: userIds.join(','),
                    message: `Новый бонус за репост.`,
                    attachment: `wall-${config["vk-group"].id}_${postId}` ,
                    random_id: features.random.integer(-200000000, 200000000),
                })

                sentToUsers += userIds.length
            } catch (error) {
                throw new Error(error)
            }
        }
    })
}