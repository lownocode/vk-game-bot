export const shop = {
    access: "private",
    pattern: /shop|магазин/i,
    handler: async message => {
        message.send("команда в разработке")
    }
}