import { vk, config } from "../../main.js"
import { features } from "../utils/index.js"
import { User, Wall } from "../../db/models.js"

export const onRepostMiddleware = async (event) => {
    if (!event.wall.copyHistory.length) return

    const post = await Wall.findOne({
        where: {
            wallId: event.wall.copyHistory[0].id
        }
    })

    if (!post || Number(post.expireAt) !== 0 && Date.now() > Number(post.expireAt)) return

    const user = await User.findOne({
        where: {
            vkId: event.wall.ownerId
        }
    })

    if (!user) return

    if (post.type === "fortune") {
        if (post.reposts.includes(user.id)) return

        post.reposts = [...post.reposts, user.id]
        return await post.save()
    }

    if (post.type === "repost") {
        if (post.reposts.includes(user.id)) return

        user.balance = Number(user.balance) + config.repostBonus.reward
        post.reposts = [...post.reposts, user.id]

        await user.save()
        await post.save()

        await vk.api.messages.send({
            user_id: event.wall.ownerId,
            random_id: 0,
            message:
                `Вам было начислено ${features.split(config.repostBonus.reward)} ${config.bot.currency}\n` +
                `Спасибо за репост :)`
        })
    }
}