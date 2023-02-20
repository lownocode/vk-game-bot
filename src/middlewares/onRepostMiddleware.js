import fs from "node:fs"

import { vk, config } from "../../main.js"
import { features } from "../utils/index.js"
import { User } from "../db/models.js"
import Sequelize from "sequelize";

export const onRepostMiddleware = async (event) => {
    const postId = fs.readFileSync(`${process.cwd()}/data/bonusPostId`, "utf-8")

    const user = await User.findOne({
        where: {
            vkId: event.wall.ownerId
        },
        attributes: ["vkId", "balance", "reposts"]
    })

    if (!user || Number(postId) !== event.wall.copyHistory[0].id) return

    if (user.reposts.includes(event.wall.copyHistory[0].id)) {
        return await vk.api.messages.send({
            user_id: event.wall.ownerId,
            random_id: 0,
            message: "Вы уже получали бонус за этот этот пост, дождитесь нового поста с бонусом!",
            attachment: `wall${event.wall.copyHistory[0].ownerId}_${event.wall.copyHistory[0].id}`
        })
    }

    await User.update({
        balance: Number(user.balance) + config.repostBonus.reward,
        reposts: Sequelize.literal(`array_append(reposts, ${event.wall.copyHistory[0].id})`)
    }, {
        where: {
            vkId: user.vkId
        }
    })

    await vk.api.messages.send({
        user_id: event.wall.ownerId,
        random_id: 0,
        message:
            `Вам было начислено ${features.split(config.repostBonus.reward)} ${config.bot.currency}\n` +
            `Спасибо за репост :)`
    })
}