import { User, Wall } from "../../db/models.js"
import { config, vkuser } from "../../main.js"
import { features } from "../utils/index.js"
import { formatNumToKFormat } from "../functions/index.js"

export const onCommentMiddleware = async event => {
    if (!event.isWallComment || !event.isNew || !event.isUser) return

    const post = await Wall.findOne({
        where: {
            wallId: event.objectId
        }
    })

    if (!post) return

    if (
        post.type === "fortune" && /крутить/i.test(event.text)
    ) {
        const user = await User.findOne({
            where: {
                vkId: event.fromId
            }
        })

        if (!user) {
            return await vkuser.api.wall.createComment({
                owner_id: -config["vk-group"].id,
                post_id: event.objectId,
                from_group: config["vk-group"].id,
                reply_to_comment: event.id,
                message: `Ой, кажется, вы не зарегистрированы в боте. Зарегистрируйтесь и возвращайтесь - vk.me/club${config["vk-group"].id}`
            })
        }

        if (post.activations.filter(uid => uid === user.id).length >= 2) {
            return await vkuser.api.wall.createComment({
                owner_id: -config["vk-group"].id,
                post_id: event.objectId,
                from_group: config["vk-group"].id,
                reply_to_comment: event.id,
                message: `Вы исчерпали количество попыток, дождитесь следующей фортуны`
            })
        }

        if (
            post.activations.includes(user.id) &&
            !post.reposts.includes(user.id)
        ) {
            return await vkuser.api.wall.createComment({
                owner_id: -config["vk-group"].id,
                post_id: event.objectId,
                from_group: config["vk-group"].id,
                reply_to_comment: event.id,
                message: `Вы уже получали бонус за этот пост, ещё одну попытку можно получить за репост этой записи`
            })
        }

        post.reposts = post.reposts.map(uid => (uid === user.id) ? null : uid).filter(uid => uid)
        post.activations = [...post.activations, user.id]

        await post.save()

        const reward = config.fortuneBonus.rewards[rewardsIds[features.random.integer(0, rewardsIds.length - 1)]]

        user.balance = Number(user.balance) + reward.coins
        await user.save()

        return await vkuser.api.wall.createComment({
            owner_id: -config["vk-group"].id,
            post_id: event.objectId,
            from_group: config["vk-group"].id,
            reply_to_comment: event.id,
            attachments: reward.image,
            message: `✨ Вы выиграли ${formatNumToKFormat(reward.coins)} ${config.bot.currency}`
        })
    }
}

const rewardsIds = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1,
    2, 2, 2, 2, 2, 2,
    3, 3, 3, 3,
    4,
]