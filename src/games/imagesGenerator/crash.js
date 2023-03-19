import { createCanvas, loadImage } from "canvas"

const PATH_TO_IMAGES = process.cwd() + "/assets/crash/"
const BACKGROUND_WIDTH = 1500
const BACKGROUND_HEIGHT = 1500
const NUMBER_FONT_SIZE = 140

export const crashImage = async (data) => {
    const canvas = createCanvas(BACKGROUND_WIDTH, BACKGROUND_HEIGHT)
    const ctx = canvas.getContext("2d")

    const backgroud = await loadImage(getBackground(data.point))

    ctx.drawImage(backgroud, 0, 0)

    const text = "x" + data.point.toString()

    ctx.font = `bold ${NUMBER_FONT_SIZE}px sans-serif`
    ctx.fillStyle = "white"

    const textWidth = ctx.measureText(text).width

    ctx.fillText(
        text,
        (BACKGROUND_WIDTH - textWidth) / 2,
        (BACKGROUND_HEIGHT + NUMBER_FONT_SIZE) / 2.3
    )

    return canvas.toBuffer("image/jpeg")
}

const getBackground = (point) => {
    if (point < 1.50) return PATH_TO_IMAGES + "negative.png"

    return PATH_TO_IMAGES + "positive.png"
}