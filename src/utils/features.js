export const features = {
    random: {
        integer: (min, max) => {
            return Math.round(
                min - 0.5 + Math.random() * (max - min + 1)
            );
        }
    },

    split: (number) => {
        return Math.round(Number(number)).toLocaleString("en-US").replace(/,/g, " ")
    },

    getSecondsToTomorrow: () => {
        const now = new Date()
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

        return tomorrow - now;
    }
}