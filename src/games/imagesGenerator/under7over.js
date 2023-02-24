import { createCanvas, loadImage } from "canvas"

const PATH_TO_IMAGES = process.cwd() + "/assets/under7over/"
const BACKGROUND_WIDTH = 1500
const BACKGROUND_HEIGHT = 1500
const DICE_WIDTH = 430
const DICE_HEIGHT = 430

export const under7overImage = async (data) => {
    const canvas = createCanvas(BACKGROUND_WIDTH, BACKGROUND_HEIGHT)
    const ctx = canvas.getContext("2d")

    const background = await loadImage(PATH_TO_IMAGES + "background.png")
    const leftDice = await loadImage(PATH_TO_IMAGES + `${data.leftDiceSum}.png`)
    const rightDice = await loadImage(PATH_TO_IMAGES + `${data.rightDiceSum}.png`)

    ctx.drawImage(background, 0, 0)

    /* генерация левого кубика */

    ctx.translate(
        (BACKGROUND_WIDTH - DICE_WIDTH) / 2 + DICE_WIDTH / 2,
        (BACKGROUND_HEIGHT - DICE_HEIGHT) + DICE_HEIGHT / 2
    )
    ctx.rotate(15 * Math.PI / 180)
    ctx.drawImage(
        leftDice,
        (-DICE_WIDTH / 2) - (BACKGROUND_WIDTH / 3.3),
        (-DICE_HEIGHT / 2) - (BACKGROUND_HEIGHT / 2.5),
        DICE_WIDTH,
        DICE_HEIGHT
    )

    /* генерация правого кубика */

    ctx.translate(
        (-DICE_WIDTH / 2) + (BACKGROUND_WIDTH / 4),
        (-DICE_HEIGHT / 2) - (BACKGROUND_HEIGHT / 2),
    )
    ctx.rotate(-(30 * Math.PI / 180))
    ctx.drawImage(
        rightDice,
        (-DICE_WIDTH / 2) - (BACKGROUND_WIDTH / 6),
        (-DICE_HEIGHT / 2) + (BACKGROUND_HEIGHT / 3.3),
        DICE_WIDTH,
        DICE_HEIGHT
    )

    return canvas.toBuffer("image/jpeg")
}