import { config, vk } from "../../../main.js"

export const subscribeBonus = {
    access: "private",
    pattern: /^(subscribe bonus|бонус за подписку)$/i,
    handler: async message => {
        if (message.user.isSubscribedOnGroup) {
            return message.send('Ты уже получал бонус за подписку.')
        }

        const isSubscribed = await vk.api.groups.isMember({
            group_id: config["vk-group"].id,
            user_id: message.senderId,
        })

        if (isSubscribed) {
            message.user.balance = Number(message.user.balance) + 1000
            message.user.isSubscribedOnGroup = true
            await message.user.save()

            return await message.send('За подписку на группу вы получили 1 000 на свой баланс')
        }

        message.send('Для получения бонуса за подписку нужно подписаться на группу.')
    }
}