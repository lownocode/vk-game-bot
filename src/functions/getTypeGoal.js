export const getTypeGoal = (value) => {
    switch (typeof value) {
        case "number": {
            if (value === 0) {
                return "zero"
            }

            if (value >= 1 && value <= 7) {
                return "red"
            }

            if (value >= 8 && value <= 14) {
                return "black"
            }
        }

        case "string": {
            if (value === 'zero') {
                return "ничья 🏀"
            }

            if (value === 'red') {
                return "победа красных 🔴"
            }

            if (value === 'black') {
                return "победа чёрных ⚫"
            }
        }
    }
}