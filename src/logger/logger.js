import chalk from "chalk"

export const logger = {
    success (text) {
        console.log(
            chalk.bgGreen(
                chalk.black(text)
            )
        )
    },

    failure (text) {
        console.log(
            chalk.bgRed(
                chalk.black(text)
            )
        )
    }
}