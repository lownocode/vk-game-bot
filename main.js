import { VK } from "vk-io"
import { HearManager } from "@vk-io/hear"
import { QuestionManager } from "vk-io-question"
import { PAYOK } from "payok"
import YAML from "yaml"
import fs from "fs"

import "./api/main.js"
import "./src/db/sequelize.js"
import * as commands from "./src/commands/index.js"
import {
    onRepostMiddleware,
    onMessageMiddleware,
    onChatInviteMiddleware
} from "./src/middlewares/index.js"
import { clearDailyRating, createDailyRewardPost } from "./src/functions/index.js"
import { features } from "./src/utils/index.js"
import { logger } from "./src/logger/logger.js"
import { gamesObserver } from "./src/games/index.js"
import { handlePayokPayment } from "./src/handlers/index.js"

export const config = YAML.parse(
    fs.readFileSync("./data/config.yaml", "utf-8")
)

const hearManager = new HearManager()
const questionManager = new QuestionManager()

export const vk = new VK({ token: config["vk-group"].token })
export const vkuser = new VK({ token: config["vk-user"].token })
export const payok = new PAYOK({
    apiId: config.payok.apiId,
    apiKey: config.payok.apiToken,
    secretKey: config.payok.shopKey,
    shop: config.payok.shopId
})

payok.events.on("payment", handlePayokPayment)

vk.updates.on("message_new", questionManager.middleware)
vk.updates.on("message_new", onMessageMiddleware)
vk.updates.on("message_new", hearManager.middleware)
vk.updates.on("wall_post", onRepostMiddleware)
vk.updates.on("chat_invite_user", onChatInviteMiddleware)

export const commandsList = Object.values(commands)

commandsList.forEach(({ pattern, handler }) => hearManager.hear(pattern, handler))

const setupIntervals = () => {
    const setupClearDailyRatingInterval = () => {
        setTimeout(() => {
            clearDailyRating().then(() => setupClearDailyRatingInterval())
        }, features.getSecondsToTomorrow())

        logger.success(`ClearDailyRatingInterval was setup [${features.getSecondsToTomorrow()}]`)
    }

    const setupCreateDailyRewardPostInterval = () => {
        setTimeout(() => {
            createDailyRewardPost().then(() => setupCreateDailyRewardPostInterval())
        }, features.getSecondsToTomorrow())

        logger.success(`CreateDailyRewardPostInterval was setup [${features.getSecondsToTomorrow()}]`)
    }

    setupClearDailyRatingInterval()
    setupCreateDailyRewardPostInterval()
}

setupIntervals()
gamesObserver().then(() => logger.success("games observer has been started"))

payok.createWebhook(7576, "/payok").then(() => logger.success("payok callback server was started"))
vk.updates.start().then(() => logger.success("bot has been started"))