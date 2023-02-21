export const addCoinsToUser = async (user, coins) => {
    const parsedCoins = Math.round(coins)

    user.balance = Number(user.balance) + parsedCoins
    user.winCoins = Number(user.winCoins) + parsedCoins
    user.winCoinsToday = Number(user.winCoinsToday) + parsedCoins

    await user.save()
}