export const formatSum = (string, message) => {
    if (/вб|вс[её]/i.test(string)) {
        if (!message) return null

        return Number(message.user.balance)
    }

    const multiplier = string
        .replace(/^\[club(\d+)\|(.*)]/i, "")
        .replace(/[^kк]+/i, "").length * 3
    const number = parseFloat(
        string
            .replace(/^\[club(\d+)\|(.*)]/i, "")
            .replace(/[^\d.]/g, "")
    )

    return number * Math.pow(10, multiplier)
}