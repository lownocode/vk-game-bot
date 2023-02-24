import { createCanvas, loadImage } from "canvas"

const PATH_TO_IMAGES = process.cwd() + "/assets/double/"
const BACKGROUND_WIDTH = 1500
const BACKGROUND_HEIGHT = 1500
const X_FONT_SIZE = 200

export const doubleImage = async (data) => {
    const canvas = createCanvas(BACKGROUND_WIDTH, BACKGROUND_HEIGHT)
    const ctx = canvas.getContext("2d")

    const background = await loadImage(PATH_TO_IMAGES + `x${data.multiplier}.png`)

    ctx.drawImage(background, 0, 0)

    const text = `x${data.multiplier}`

    ctx.font = `bold ${X_FONT_SIZE}px sans-serif`
    ctx.fillStyle = getTextColor(data.multiplier)

    const textWidth = ctx.measureText(text).width

    ctx.fillText(
        text,
        (BACKGROUND_WIDTH - textWidth) / 2,
        (BACKGROUND_HEIGHT + X_FONT_SIZE) / 2.06
    )

    return canvas.toBuffer("image/jpeg")
}

const getTextColor = (x) => {
    switch (x) {
        case 50: return "#ff0000"
        case 5: return "#3b54ec"
        case 3: return "#dde01f"
        case 2: return "#FFF"
    }
}