import { createCanvas, loadImage } from "canvas"

const PATH_TO_IMAGES = process.cwd() + "/assets/basketball/"
const BACKGROUND_WIDTH = 1500
const BACKGROUND_HEIGHT = 1500
const NUMBER_FONT_SIZE = 100

export const basketballImage = async (data) => {
    const canvas = createCanvas(BACKGROUND_WIDTH, BACKGROUND_HEIGHT)
    const ctx = canvas.getContext("2d")

    const background = await loadImage(PATH_TO_IMAGES + "background.png")

    ctx.drawImage(background, 0, 0)

    const redTeamScore = data.winners === "red" ? data.score : 0
    const blueTeamScore = data.winners === "blue" ? data.score : 0

    //* red team score generation *//

    ctx.font = `${NUMBER_FONT_SIZE}px sans-serif`
    ctx.fillStyle = "white"

    const redTeamTextWidth = ctx.measureText(redTeamScore).width

    ctx.fillText(
        redTeamScore,
        (BACKGROUND_WIDTH - redTeamTextWidth) / 2.45,
        (BACKGROUND_HEIGHT + NUMBER_FONT_SIZE) / 1.79
    )

    //* blue team score generation *//

    ctx.font = `${NUMBER_FONT_SIZE}px sans-serif`
    ctx.fillStyle = "white"

    const blueTeamTextWidth = ctx.measureText(blueTeamScore).width

    ctx.fillText(
        blueTeamScore,
        (BACKGROUND_WIDTH - blueTeamTextWidth) / 1.65,
        (BACKGROUND_HEIGHT + NUMBER_FONT_SIZE) / 1.79
    )

    return canvas.toBuffer("image/jpeg")
}