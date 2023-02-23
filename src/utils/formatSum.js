export const formatSum = (string) => {
    const multiplier = string.replace(/[^kк]+/i, "").length * 3
    const number = parseFloat(
        string
            .replace(/^\[club(\d+)\|(.*)]/i, "")
            .replace(/[^\d.]/g, "")
    )

    return number * Math.pow(10, multiplier)
}