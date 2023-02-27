import Fastify from "fastify"

import * as routes from "./routes/index.js"
import { logger } from "../src/logger/logger.js"
import { onRequestMiddleware } from "./middlewares/index.js"

const PORT = 7234

const fastify = new Fastify()

Object.values(routes).forEach(route => fastify.register(route))

fastify.addHook("onRequest", onRequestMiddleware)

fastify
    .listen({ host: "0.0.0.0", port: PORT })
    .then(() => logger.success("API was started on port " + PORT))