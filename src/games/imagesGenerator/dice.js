import { createCanvas, loadImage } from "canvas"

const PATH_TO_IMAGES = process.cwd() + "/assets/dice/"
const BACKGROUND_WIDTH = 1500
const BACKGROUND_HEIGHT = 1500
const DICE_WIDTH = 600
const DICE_HEIGHT = 600

export const diceImage = async (data) => {
    const canvas = createCanvas(BACKGROUND_WIDTH, BACKGROUND_HEIGHT)
    const ctx = canvas.getContext("2d")

    const background = await loadImage(PATH_TO_IMAGES + "background.png")
    const dice = await loadImage(PATH_TO_IMAGES + `${data.number}.png`)

    ctx.drawImage(background, 0, 0)
    ctx.drawImage(
        dice,
        (BACKGROUND_WIDTH - DICE_WIDTH) / 2,
        (BACKGROUND_HEIGHT - DICE_HEIGHT) / 2,
        DICE_WIDTH,
        DICE_HEIGHT
    )

    return canvas.toBuffer("image/jpeg")
}