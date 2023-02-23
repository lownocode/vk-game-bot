import { Canvas, loadImage } from "canvas"

export const wheelImage = async (number) => {
    const width = 1500
    const height = 1500
    const canvas = new Canvas(width, height)
    const ctx = canvas.getContext("2d")

    const backgroud = await loadImage(getBackground(Number(number)))

    ctx.drawImage(backgroud, 0, 0)

    const text = number.toString()
    const fontSize = 190

    ctx.font = `bold ${fontSize}px sans-serif`
    ctx.fillStyle = "white"

    const textWidth = ctx.measureText(text).width

    ctx.fillText(text, (width - textWidth) / 2, (height + fontSize) / 2)

    return canvas.toBuffer("image/jpeg")
}

const getBackground = (number) => {
    const path = process.cwd() + "/assets/wheel/"

    if (number === 0) return path + "zero.png"
    if (number % 2 === 0) return path + "red.png"

    return path + "black.png"
}