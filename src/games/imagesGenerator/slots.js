import { createCanvas, loadImage } from "canvas"

const PATH_TO_IMAGES = process.cwd() + "/assets/slots/"
const BACKGROUND_WIDTH = 1500
const BACKGROUND_HEIGHT = 1500
const FRUIT_WIDTH = 200
const FRUIT_HEIGHT = 200

export const slotsImage = async (data) => {
    const canvas = createCanvas(BACKGROUND_WIDTH, BACKGROUND_HEIGHT)
    const ctx = canvas.getContext("2d")

    const background = await loadImage(PATH_TO_IMAGES + "background.png")
    const firstFruit = await loadImage(PATH_TO_IMAGES + `${data.solution[0]}-fruit.png`)
    const secondFruit = await loadImage(PATH_TO_IMAGES + `${data.solution[1]}-fruit.png`)
    const thirdFruit = await loadImage(PATH_TO_IMAGES + `${data.solution[2]}-fruit.png`)

    ctx.drawImage(background, 0, 0)
    ctx.drawImage(
        firstFruit,
        (BACKGROUND_WIDTH / 2) - (FRUIT_WIDTH * 2),
        (BACKGROUND_HEIGHT / 2) - (FRUIT_HEIGHT / 2),
        FRUIT_WIDTH,
        FRUIT_HEIGHT
    )
    ctx.drawImage(
        secondFruit,
        (BACKGROUND_WIDTH / 2) - (FRUIT_WIDTH / 2),
        (BACKGROUND_HEIGHT / 2) - (FRUIT_HEIGHT / 2),
        FRUIT_WIDTH,
        FRUIT_HEIGHT
    )
    ctx.drawImage(
        thirdFruit,
        BACKGROUND_WIDTH - (FRUIT_WIDTH * 3) + (FRUIT_HEIGHT / 4),
        (BACKGROUND_HEIGHT / 2) - (FRUIT_HEIGHT / 2),
        FRUIT_WIDTH,
        FRUIT_HEIGHT
    )

    return canvas.toBuffer("image/jpeg")
}