import { Keyboard } from "vk-io"

export const privateKeyboard = (user) => {
    const keyboard = Keyboard.builder()

    keyboard.textButton({
            label: 'Найти беседу',
            payload: {
                command: 'search'
            },
            color: Keyboard.PRIMARY_COLOR
        })
        .textButton({
            label: 'Профиль',
            payload: {
                command: 'profile'
            },
            color: Keyboard.PRIMARY_COLOR
        })
        .row()
        .textButton({
            label: 'Халява',
            payload: {
                command: 'freebie'
            },
            color: Keyboard.NEGATIVE_COLOR
        })
        .textButton({
            label: 'Мини игры',
            payload: {
                command: 'minigames'
            },
            color: Keyboard.NEGATIVE_COLOR
        })
        .textButton({
            label: 'Топ дня',
            payload: {
                command: 'topDay'
            },
            color: Keyboard.NEGATIVE_COLOR
        })
        .row()
        .textButton({
            label: `Рассылка (${user.newsletter ? 'вкл' : 'выкл'})`,
            payload: {
                command: 'newsletter'
            },
            color: user.newsletter ? Keyboard.POSITIVE_COLOR : Keyboard.NEGATIVE_COLOR
        })
        .textButton({
            label: 'Топ игроков',
            payload: {
                command: 'top'
            },
            color: Keyboard.POSITIVE_COLOR
        })
        .row()
        .textButton({
            label: 'Магазин',
            payload: {
                command: 'shop'
            },
            color: Keyboard.POSITIVE_COLOR
        })
        .row()


    return keyboard
}