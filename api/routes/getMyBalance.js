export const getMyBalance = async (fastify) => fastify.post("/api/getMyBalance", async (req, res) => {
    res.send({
        userId: req.user.vkId,
        balance: Number(req.user.balance)
    })
})