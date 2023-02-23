import { checkChatUserIsAdmin, convertChatMode } from "../../functions/index.js"
import { modeKeyboard } from "../../keyboards/index.js"
import { Keyboard } from "vk-io"

export const chatSettings = {
    command: "chatSettings",
    pattern: /^$/i,
    handler: async (message, data) => {
        const checkUser = await checkChatUserIsAdmin(message.peerId, message.senderId)

        if (checkUser.isError) {
            return message.send(
                "Выдайте боту администратора в чате, иначе изменить настройки не получится"
            )
        }

        if (!checkUser.isAdmin) {
            return message.send("Вы не являетесь администратором или плательщиком чата")
        }

        switch (data) {
            case "mode": {
                return message.send(
                    `🎮 Сейчас в беседе установлен режим ${convertChatMode(message.chat.mode, false).toLowerCase()}\n`+
                    `🔗 Чтобы сменить режим, нажмите на одну из кнопок ниже`, {
                        keyboard: modeKeyboard()
                    }
                )
            }
            case "timer": {
                const currentModeTime = message.chat.modeRoundTime[message.chat.mode]

                const { text: time, payload } = await message.question(
                    `Время раунда режима ${convertChatMode(message.chat.mode, false).toLowerCase()} - ${currentModeTime} сек.\n\n` +
                    "Напишите новое время для этого режима:", {
                        keyboard: cancelButton
                    }
                )

                if (payload?.cancel) {
                    return message.send("Вы отменили смену времени текущего режима")
                }

                if (!time || isNaN(Number(time)) || !Number(time) || Number(time) > 300 || Number(time) < 1) {
                    return message.send("Минимально возможное время - 1 секунда, а максимальное - 300 секунд")
                }

                message.chat.modeRoundTime = {
                    ...message.chat.modeRoundTime,
                    [message.chat.mode]: Number(time)
                }
                await message.chat.save()

                return message.send(
                    `Теперь время раунда для режима ${convertChatMode(message.chat.mode, false).toLowerCase()} ` +
                    `составляет ${Number(time)} сек.`
                )
            }
        }
    }
}

const cancelButton = Keyboard.builder().textButton({
    label: "Отмена",
    color: Keyboard.NEGATIVE_COLOR,
    payload: {
        cancel: true
    }
}).inline()