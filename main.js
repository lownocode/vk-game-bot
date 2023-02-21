import { VK } from "vk-io"
import { HearManager } from "@vk-io/hear"
import { QuestionManager } from "vk-io-question"
import YAML from "yaml"
import fs from "fs"

import "./src/db/sequelize.js"
import * as commands from "./src/commands/index.js"
import {
    onRepostMiddleware,
    onMessageMiddleware,
    callbackMessageMiddleware,
    onChatInviteMiddleware
} from "./src/middlewares/index.js"
import { clearDailyRating, createDailyRewardPost } from "./src/functions/index.js"
import { features } from "./src/utils/index.js"
import { logger } from "./src/logger/logger.js"
import { gamesObserver } from "./src/games/index.js"

export const config = YAML.parse(
    fs.readFileSync("./data/config.yaml", "utf-8")
)

const hearManager = new HearManager()
const questionManager = new QuestionManager()

export const vk = new VK({ token: config["vk-group"].token })
export const vkuser = new VK({ token: config["vk-user"].token })

vk.updates.on("message_new", questionManager.middleware)
vk.updates.on("message_new", onMessageMiddleware)
vk.updates.on("message_new", hearManager.middleware)
vk.updates.on("message_event", callbackMessageMiddleware)
vk.updates.on("wall_post", onRepostMiddleware)
vk.updates.on("chat_invite_user", onChatInviteMiddleware)

export const commandsList = Object.values(commands)

commandsList.forEach(({ pattern, handler }) => hearManager.hear(pattern, handler))

const setupIntervals = () => {
    const setupClearDailyRatingInterval = () => {
        setInterval(() => {
            clearDailyRating().then(() => setupClearDailyRatingInterval())
        }, features.getSecondsToTomorrow())

        logger.success(`ClearDailyRatingInterval was setup [${features.getSecondsToTomorrow()}]`)
    }

    const setupCreateDailyRewardPostInterval = () => {
        setInterval(() => {
            createDailyRewardPost().then(() => setupCreateDailyRewardPostInterval())
        }, features.getSecondsToTomorrow())

        logger.success(`CreateDailyRewardPostInterval was setup [${features.getSecondsToTomorrow()}]`)
    }

    setupClearDailyRatingInterval()
    setupCreateDailyRewardPostInterval()
}

setupIntervals()
gamesObserver().then(() => logger.success("games observer has been started"))

vk.updates.start().then(() => logger.success("bot has been started"))