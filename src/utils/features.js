export const features = {
    random: {
        integer: (min, max) => {
            return Math.round(
                min - 0.5 + Math.random() * (max - min + 1)
            );
        },

        string: (length) => {
            let result           = '';
            let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let charactersLength = characters.length;

            for ( let i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }

            return result;
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