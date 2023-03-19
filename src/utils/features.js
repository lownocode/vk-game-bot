import crypto from "crypto"

export const features = {
    random: {
        integer: (min, max) => {
            const range = max - min + 1
            const bytes_needed = Math.ceil(Math.log2(range) / 8)
            const cutoff = Math.floor((256 ** bytes_needed) / range) * range
            const bytes = new Uint8Array(bytes_needed)

            let value
            do {
                crypto.getRandomValues(bytes)
                value = bytes.reduce((acc, x, n) => acc + x * 256 ** n, 0)
            } while (value >= cutoff)

            return min + value % range
        }
    },

    split: (number) => {
        return Math.round(Number(number)).toLocaleString("en-US").replace(/,/g, " ")
    },

    getSecondsToTomorrow: () => {
        const now = new Date()
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

        return tomorrow - now
    },

    getSecondsToNextMonday: () => {
        const today = new Date()
        const daysUntilMonday = 1 + 7 - today.getDay()
        const nextMonday = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + daysUntilMonday
        )

        return nextMonday.getTime() - today.getTime()
    }
}