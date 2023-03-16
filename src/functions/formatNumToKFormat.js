export const formatNumToKFormat = num => {
    if (num < 1000) return num.toString()

    const exp = Math.floor(Math.log10(num) / 3)
    const roundedNum = (num / Math.pow(1000, exp)).toFixed(2)

    return `${parseFloat(roundedNum)}${"K".repeat(exp)}`
}