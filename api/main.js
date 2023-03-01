import Fastify from "fastify"
import fs from "fs"

import * as routes from "./routes/index.js"
import { logger } from "../src/logger/logger.js"
import { onRequestMiddleware } from "./middlewares/index.js"

const IS_DEV = !false
const PORT = IS_DEV ? 7234 : 443

const fastify = new Fastify(!IS_DEV && {
    https: {
        key: fs.readFileSync("/etc/letsencrypt/live/scoinbot.ru/privkey.pem"),
        cert: fs.readFileSync("/etc/letsencrypt/live/scoinbot.ru/fullchain.pem"),
    },
})

Object.values(routes).forEach(route => fastify.register(route))

fastify.addHook("onRequest", onRequestMiddleware)

fastify
    .listen({ host: "0.0.0.0", port: PORT })
    .then(() => logger.success("API was started on port " + PORT))