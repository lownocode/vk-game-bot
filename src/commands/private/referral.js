import { config, vk } from "../../../main.js"
import { User } from "../../../db/models.js"
import { declOfNum, features } from "../../utils/index.js"

export const referral = {
    access: "private",
    pattern: /^рефералка$/i,
    handler: async message => {
        const link = await vk.api.utils.getShortLink({
            url: `https://vk.me/club${config["vk-group"].id}?ref=${message.senderId}`
        })

        const referrals = await User.findAll({
            attributes: ["id", "createdAt"],
            where: { referrer: message.senderId }
        })

        message.send(
            `Вы пригласили ${referrals.length} ${declOfNum(referrals.length, ["реферала", "реферала", "рефералов"])}\n` +
            `Рефералы принесли вам ${features.split(message.user.referralsProfit)} ${config.bot.currency}\n\n` +
            `За каждого реферала вы и ваш реферал получите 250K ${config.bot.currency}, а также 0.15% со ставок и 5% с пополнений реферала\n` +
            `Ваша реферальная ссылка: vk.cc/${link.key}`
        )
    }
}