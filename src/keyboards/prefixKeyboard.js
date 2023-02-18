import { Keyboard } from "vk-io"

export const prefixKeyboard = (user) => {
    const keyboard = Keyboard.builder()

    if(user.is.Vip) {
        keyboard.textButton({
            label: '[V]',
        })
        keyboard.textButton({
            label: '[VIP]',
        })
        keyboard.row()
    }
    if(user.is.Admin) {
        keyboard.textButton({
            label: '[A]',
        })
        keyboard.textButton({
            label: '[ADM]',
        })
        keyboard.textButton({
            label: '[ADMIN]',
        })
        keyboard.row()
    }
    keyboard.textButton({
        label: 'Меню',
        color: Keyboard.NEGATIVE_COLOR
    })

    return keyboard
}