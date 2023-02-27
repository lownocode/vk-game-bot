import { Sequelize } from "sequelize"
import YAML from "yaml"
import fs from "fs"

import { logger } from "../src/logger/logger.js"

const config = YAML.parse(
    fs.readFileSync(process.cwd() + "/data/config.yaml", "utf-8")
)

export const sequelize = new Sequelize(
    config.postgres.name,
    config.postgres.user,
    config.postgres.password,
    {
        dialect: "postgres",
        host: config.postgres.host,
        port: config.postgres.port,
        logging: false
    },
)

sequelize.sync({ alter: true }).then(() => {
    logger.success("PostgreSQL has been synchronized")
})