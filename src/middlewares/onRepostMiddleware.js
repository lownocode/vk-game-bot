import { vk, config } from "../../main.js"
import { features } from "../utils/index.js"
import {User} from "../db/models.js";

export const onRepostMiddleware = async (context) => {
    // const lastPostId = config.bonus.postId
    // const user = await User.findOne({ where: { vkId: context.wall.ownerId } })
    //
    // if (!user || user.reposts.includes(context.wall.copyHistory[0].id)) return
    // if (lastPostId !== context.wall.copyHistory[0].id) return
    //
    // user.reposts.push(context.wall.copyHistory[0].id)
    // user.bonusBalance += config.bonus.reward * 0.01
    //
    // await vk.api.messages.send({
    //     user_id: context.wall.ownerId,
    //     random_id: features.random.integer(-200000000, 200000000),
    //     message: `Вам было начислено ${features.split(config.bonus.reward)} ${config.bot.currency} на бонусный баланс`,
    // })
    // await user.save();
}