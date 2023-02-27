import { createCanvas, loadImage } from "canvas"

import { config } from "../../../main.js"

const PATH_TO_IMAGES = process.cwd() + "/assets/wheel/"
const BACKGROUND_WIDTH = 1500
const BACKGROUND_HEIGHT = 1500
const NUMBER_FONT_SIZE = 190

export const wheelImage = async (data) => {
    const canvas = createCanvas(BACKGROUND_WIDTH, BACKGROUND_HEIGHT)
    const ctx = canvas.getContext("2d")

    const backgroud = await loadImage(getBackground(Number(data.number)))

    ctx.drawImage(backgroud, 0, 0)

    const text = data.number.toString()

    ctx.font = `bold ${NUMBER_FONT_SIZE}px sans-serif`
    ctx.fillStyle = "white"

    const textWidth = ctx.measureText(text).width

    ctx.fillText(
        text,
        (BACKGROUND_WIDTH - textWidth) / 2,
        (BACKGROUND_HEIGHT + NUMBER_FONT_SIZE) / 2.04
    )

    return canvas.toBuffer("image/jpeg")
}

const getBackground = (number) => {
    if (number === 0) return PATH_TO_IMAGES + "zero.png"
    if (config.games.wheelNumbers.red.includes(number)) return PATH_TO_IMAGES + "red.png"

    return PATH_TO_IMAGES + "black.png"
}