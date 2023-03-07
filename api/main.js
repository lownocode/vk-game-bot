import Fastify from "fastify"
import fs from "fs"

import * as routes from "./routes/index.js"
import { logger } from "../src/logger/logger.js"
import { onRequestMiddleware } from "./middlewares/index.js"
import { readableDate } from "../src/functions/index.js"

const IS_DEV = process.env.NODE_ENV === "dev"
const PORT = IS_DEV ? 7234 : 443

const fastify = new Fastify(!IS_DEV && {
    https: {
        key: fs.readFileSync("/etc/letsencrypt/live/scoinbot.ru/privkey.pem"),
        cert: fs.readFileSync("/etc/letsencrypt/live/scoinbot.ru/fullchain.pem"),
    },
})

fastify.addHook("preHandler", onRequestMiddleware)
fastify.addHook("onRequest", (req, _, next) => {
    logger.success(`${readableDate(Date.now())}: new API request: ${req.url}`)

    return next()
})

fastify.register(import("@fastify/cors"), {
    origin: "*"
})

Object.values(routes).forEach(route => fastify.register(route))

fastify
    .listen({ host: "0.0.0.0", port: PORT })
    .then(() => logger.success("API was started on port " + PORT))