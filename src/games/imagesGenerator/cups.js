import { createCanvas, loadImage } from "canvas"

const PATH_TO_IMAGES = process.cwd() + "/assets/cups/"
const BACKGROUND_WIDTH = 1500
const BACKGROUND_HEIGHT = 1500

export const cupsImage = async (data) => {
    const canvas = createCanvas(BACKGROUND_WIDTH, BACKGROUND_HEIGHT)
    const ctx = canvas.getContext("2d")

    const background = await loadImage(PATH_TO_IMAGES + `${data.filled}.png`)

    ctx.drawImage(background, 0, 0)

    return canvas.toBuffer("image/jpeg")
}