import { Keyboard } from "vk-io"

export const chatMainKeyboard = (mode) => {
    const keyboard = Keyboard.builder()

    keyboard
        .textButton({
            label: "Банк",
            color: Keyboard.SECONDARY_COLOR
        })
        .textButton({
            label: "Баланс",
            color: Keyboard.SECONDARY_COLOR
        })
        .row()

    switch (mode) {
        case "slots": {
            keyboard
                .textButton({
                    label: "🍓 x1",
                    payload: {
                        command: "bet-slots/1_1"
                    },
                    color: Keyboard.POSITIVE_COLOR
                })
                .textButton({
                    label: "🍋 x1",
                    payload: {
                        command: "bet-slots/1_2"
                    },
                    color: Keyboard.POSITIVE_COLOR
                })
                .textButton({
                    label: "🍏 x1",
                    payload: {
                        command: "bet-slots/1_3"
                    },
                    color: Keyboard.POSITIVE_COLOR
                })
                .textButton({
                    label: "🍑 x1",
                    payload: {
                        command: "bet-slots/1_4"
                    },
                    color: Keyboard.POSITIVE_COLOR
                })
                .row()
                .textButton({
                    label: "🍓 x2",
                    payload: {
                        command: "bet-slots/2_1"
                    },
                    color: Keyboard.PRIMARY_COLOR
                })
                .textButton({
                    label: "🍋 x2",
                    payload: {
                        command: "bet-slots/2_2"
                    },
                    color: Keyboard.PRIMARY_COLOR
                })
                .textButton({
                    label: "🍏 x2",
                    payload: {
                        command: "bet-slots/2_3"
                    },
                    color: Keyboard.PRIMARY_COLOR
                })
                .textButton({
                    label: "🍑 x2",
                    payload: {
                        command: "bet-slots/2_4"
                    },
                    color: Keyboard.PRIMARY_COLOR
                })
                .row()
                .textButton({
                    label: "🍓 x3",
                    payload: {
                        command: "bet-slots/3_1"
                    },
                    color: Keyboard.NEGATIVE_COLOR
                })
                .textButton({
                    label: "🍋 x3",
                    payload: {
                        command: "bet-slots/3_2"
                    },
                    color: Keyboard.NEGATIVE_COLOR
                })
                .textButton({
                    label: "🍏 x3",
                    payload: {
                        command: "bet-slots/3_3"
                    },
                    color: Keyboard.NEGATIVE_COLOR
                })
                .textButton({
                    label: "🍑 x3",
                    payload: {
                        command: "bet-slots/3_4"
                    },
                    color: Keyboard.NEGATIVE_COLOR
                })
                .row()

            break
        }
        case "dice": {
            keyboard
                .textButton({
                    label: "Четное",
                    payload: {
                        command: "bet-dice/even"
                    },
                })
                .textButton({
                    label: "Нечетное",
                    payload: {
                        command: "bet-dice/noteven"
                    },
                })
                .row()
                .textButton({
                    label: "1",
                    payload: {
                        command: "bet-dice/1"
                    },
                    color: Keyboard.PRIMARY_COLOR
                })
                .textButton({
                    label: "2",
                    payload: {
                        command: "bet-dice/2"
                    },
                    color: Keyboard.PRIMARY_COLOR
                })
                .textButton({
                    label: "3",
                    payload: {
                        command: "bet-dice/3"
                    },
                    color: Keyboard.PRIMARY_COLOR
                })
                .row()
                .textButton({
                    label: "4",
                    payload: {
                        command: "bet-dice/4"
                    },
                    color: Keyboard.PRIMARY_COLOR
                })
                .textButton({
                    label: "5",
                    payload: {
                        command: "bet-dice/5"
                    },
                    color: Keyboard.PRIMARY_COLOR
                })
                .textButton({
                    label: "6",
                    payload: {
                        command: "bet-dice/6"
                    },
                    color: Keyboard.PRIMARY_COLOR
                })
                .row()

            break
        }
        case "double": {
            keyboard
                .textButton({
                    label: "x2",
                    payload: {
                        command: "bet-double/2"
                    },
                    color: Keyboard.PRIMARY_COLOR,
                })
                .textButton({
                    label: "x3",
                    payload: {
                        command: "bet-double/3"
                    },
                    color: Keyboard.PRIMARY_COLOR,
                })
                .textButton({
                    label: "x5",
                    payload: {
                        command: "bet-double/5"
                    },
                    color: Keyboard.PRIMARY_COLOR,
                })
                .textButton({
                    label: "x50",
                    payload: {
                        command: "bet-double/50"
                    },
                    color: Keyboard.PRIMARY_COLOR,
                })

            break
        }
        case "basketball": {
            keyboard
                .textButton({
                    label: "Красные",
                    payload: {
                        command: "bet-basketball/red"
                    },
                    color: Keyboard.PRIMARY_COLOR,
                })
                .textButton({
                    label: "🏀 Ничья",
                    payload: {
                        command: "bet-basketball/nobody"
                    },
                    color: Keyboard.PRIMARY_COLOR,
                })
                .textButton({
                    label: "Синие",
                    payload: {
                        command: "bet-basketball/blue"
                    },
                    color: Keyboard.PRIMARY_COLOR,
                })

            break
        }
        case "wheel": {
            keyboard
                .textButton({
                    label: "Красное",
                    payload: {
                        command: "bet-wheel/red"
                    },
                })
                .textButton({
                    label: "На число",
                    payload: {
                        command: "bet-wheel/number"
                    },
                    color: Keyboard.PRIMARY_COLOR
                })
                .textButton({
                    label: "Черное",
                    payload: {
                        command: "bet-wheel/black"
                    },
                })
                .row()
                .textButton({
                    label: "Чётное",
                    payload: {
                        command: "bet-wheel/even"
                    },
                })
                .textButton({
                    label: "Нечётное",
                    payload: {
                        command: "bet-wheel/noteven"
                    },
                })
                .row()
                .textButton({
                    label: "1-12",
                    payload: {
                        command: "bet-wheel/1-12"
                    },
                    color: Keyboard.PRIMARY_COLOR
                })
                .textButton({
                    label: "13-24",
                    payload: {
                        command: "bet-wheel/13-24"
                    },
                    color: Keyboard.PRIMARY_COLOR
                })
                .textButton({
                    label: "25-36",
                    payload: {
                        command: "bet-wheel/25-36"
                    },
                    color: Keyboard.PRIMARY_COLOR
                })
                .row()
                .textButton({
                    label: "1-18",
                    payload: {
                        command: "bet-wheel/1-18"
                    },
                    color: Keyboard.PRIMARY_COLOR
                })
                .textButton({
                    label: "19-36",
                    payload: {
                        command: "bet-wheel/19-36"
                    },
                    color: Keyboard.PRIMARY_COLOR
                })

            break
        }
        case "under7over": {
            keyboard
                .textButton({
                    label: "Меньше 7",
                    payload: {
                        command: "bet-under7over/under"
                    },
                    color: Keyboard.PRIMARY_COLOR
                })
                .textButton({
                    label: "Ровно 7",
                    payload: {
                        command: "bet-under7over/7"
                    },
                    color: Keyboard.PRIMARY_COLOR
                })
                .textButton({
                    label: "Больше 7",
                    payload: {
                        command: "bet-under7over/over"
                    },
                    color: Keyboard.PRIMARY_COLOR
                })
                .row()
                .textButton({
                    label: "На число",
                    payload: {
                        command: "bet-under7over/number"
                    },
                })
        }
    }

    keyboard.row()

    return keyboard
}