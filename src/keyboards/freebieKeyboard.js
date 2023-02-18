import { Keyboard } from "vk-io"

export const freebieKeyboard = Keyboard.builder()
    /*.textButton({
        label: 'Клик',
        payload: {
            command: 'click'
        },
    })
    */
    .row()
    .textButton({
        label: 'Получить бонус!',
        payload: {
            command: 'bonus'
        },
    })
    .textButton({
        label: 'Бонус за подписку',
        payload: {
            command: 'subscribeBonus'
        },
    })
    .row()
    .textButton({
        label: 'Меню',
        payload: {
            command: 'start'
        },
        color: Keyboard.NEGATIVE_COLOR
    })
    .row()