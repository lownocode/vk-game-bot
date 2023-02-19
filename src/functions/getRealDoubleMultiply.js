const numbers = {
    3: ['3', '5', '7'],
    5: ['1', '9'],
}

export const getRealDoubleMultiply = (number) => {
    let doSwitch = false

    if (number > 27) {
        doSwitch = true
        number = 27 - (number - 27)
    }

    const string = number.toString()

    if (!doSwitch && number === 0) return 50
    if (number % 2 === 0) return 2

    for (const number in numbers) {
        const numbersList = numbers[number]

        if (numbersList.includes(string.slice(-1))) return parseInt(number, 10)
    }
}