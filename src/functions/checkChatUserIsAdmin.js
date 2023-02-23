import { Chat } from "../db/models.js"
import { vk } from "../../main.js"

export const checkChatUserIsAdmin = async (peerId, userId) => {
    return await vk.api.messages.getConversationMembers({
        peer_id: peerId
    })
        .then(async ({ items: users }) => {
            const user = users.find((user) => user.member_id === userId)

            if (!user?.is_owner || !user?.is_admin) {
                const chat = await Chat.findOne({ where: { peerId: peerId }, attributes: ["payer"] })

                if (chat.payer === userId) return { isAdmin: true }

                return { isAdmin: false }
            }

            return { isAdmin: true }
        })
        .catch((e) => {
            return {
                isAdmin: false,
                isError: true
            }
        })
}