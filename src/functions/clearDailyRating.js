import { config, vk } from "../main.js"
import { features } from "../utils/index.js"

export const clearDailyRating = async () => {
    const maxWinDay = await usersSchema
        .find({ "is.Developer": false })
        .sort({ maxWinDay: -1 })
        .limit(10)

    const bulk = usersSchema.collection.initializeOrderedBulkOp();

    maxWinDay.forEach((res, i) => {
        bulk.find({ uid: Number(res.uid) }).update({
            $inc: { balance: +res.maxWinDay * 0.01 }
        });

        vk.api.messages.send({
            peer_id: res.uid,
            random_id: features.random.integer(-200000000, 200000000),
            message:
                "Вы вошли в топ 10 игроков за день и получили бонус в размере " +
                `${res.maxWinDay * 0.01} ${config.bot.currency}\n` +
                `Вы заняли ${i + 1} место в топе.`
        })
    });

    await bulk.execute()

    await usersSchema.collection.updateMany({}, {
        $set: {
            maxWinDay: 0,
            transferDay: 0,
            "issue.day": 0
        }
    })
}