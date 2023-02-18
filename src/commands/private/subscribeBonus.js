import { privateKeyboard } from "../../keyboards/index.js"
import { config, vk } from "../../../main.js"

export const subscribeBonus = {
    access: "private",
    pattern: /^(subscribe bonus|бонус за подписку)$/i,
    handler: async message => {
        if (message.user.isSubscribedOnGroup) {
            return message.send('Ты уже получал бонус за подписку.', {
                keyboard: privateKeyboard(message.user)
            })
        }

        const isSubscribed = await vk.api.groups.isMember({
            group_id: config["vk-group"].id,
            user_id: message.senderId,
        })

        if (isSubscribed) {
            message.user.bonusBalance += 250_000
            message.user.isSubscribedOnGroup = true
            await message.user.save()

            return await message.send('За подписку на группу вы получили 250 000 на бонусный баланс', {
                keyboard: privateKeyboard(message.user)
            })
        }

        message.send('Для получения бонуса за подписку нужно подписаться на группу.', {
            keyboard: privateKeyboard(message.user)
        })
    }
}