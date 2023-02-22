export const readableDate = (timestamp) => {
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря"
    ][date.getMonth()]
    const day = date.getDate()
    const time =
        `${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:` +
        `${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`

    return `${day} ${month} ${year} в ${time}`
}