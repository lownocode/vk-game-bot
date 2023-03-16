export const getLastMondayDate = () => {
    const currentDate = new Date()
    const currentDay = currentDate.getDay()
    let daysToMonday = currentDay - 1

    if (currentDay === 0) {
        daysToMonday = 6
    }

    return new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - daysToMonday
    )
}