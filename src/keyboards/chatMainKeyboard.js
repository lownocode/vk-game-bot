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

    if (mode === "slots") {
        keyboard
            .textButton({
                label: '🍓',
                payload: {
                    command: "bet-slots/1_1"
                },
                color: Keyboard.POSITIVE_COLOR
            })
            .textButton({
                label: '🍋',
                payload: {
                    command: "bet-slots/1_2"
                },
                color: Keyboard.POSITIVE_COLOR
            })
            .textButton({
                label: '🍏',
                payload: {
                    command: "bet-slots/1_3"
                },
                color: Keyboard.POSITIVE_COLOR
            })
            .textButton({
                label: '🍑',
                payload: {
                    command: "bet-slots/1_4"
                },
                color: Keyboard.POSITIVE_COLOR
            })
            .row()
            .textButton({
                label: '🍓',
                payload: {
                    command: 'bet-slots/2_1'
                },
                color: Keyboard.SECONDARY_COLOR
            })
            .textButton({
                label: '🍋',
                payload: {
                    command: 'bet-slots/2_2'
                },
                color: Keyboard.SECONDARY_COLOR
            })
            .textButton({
                label: '🍏',
                payload: {
                    command: 'bet-slots/2_3'
                },
                color: Keyboard.SECONDARY_COLOR
            })
            .textButton({
                label: '🍑',
                payload: {
                    command: 'bet-slots/2_4'
                },
                color: Keyboard.SECONDARY_COLOR
            })
            .row()
            .textButton({
                label: '🍓',
                payload: {
                    command: 'bet-slots/3_1'
                },
                color: Keyboard.NEGATIVE_COLOR
            })
            .textButton({
                label: '🍋',
                payload: {
                    command: 'bet-slots/3_2'
                },
                color: Keyboard.NEGATIVE_COLOR
            })
            .textButton({
                label: '🍏',
                payload: {
                    command: 'bet-slots/3_3'
                },
                color: Keyboard.NEGATIVE_COLOR
            })
            .textButton({
                label: '🍑',
                payload: {
                    command: 'bet-slots/3_4'
                },
                color: Keyboard.NEGATIVE_COLOR
            })
            .row()
    }

    if (mode === "cube") {
        keyboard
            .textButton({
                label: 'Четное',
                payload: {
                    command: "bet-cube/even"
                },
            })
            .textButton({
                label: 'Нечетное',
                payload: {
                    command: "bet-cube/noteven"
                },
            })
            .row()
            .textButton({
                label: '1',
                payload: {
                    command: "bet-cube/1"
                },
            })
            .textButton({
                label: '2',
                payload: {
                    command: "bet-cube/2"
                },
            })
            .textButton({
                label: '3',
                payload: {
                    command: "bet-cube/3"
                },
            })
            .row()
            .textButton({
                label: '4',
                payload: {
                    command: "bet-cube/4"
                },
            })
            .textButton({
                label: '5',
                payload: {
                    command: "bet-cube/5"
                },
            })
            .textButton({
                label: '6',
                payload: {
                    command: "bet-cube/6"
                },
            })
            .row()
    }

    if (mode === "double") {
        keyboard
            .textButton({
                label: "Black x2",
                payload: {
                    command: "bet-double/2"
                },
                color: Keyboard.PRIMARY_COLOR,
            })
            .textButton({
                label: "Red x3",
                payload: {
                    command: "bet-double/3"
                },
                color: Keyboard.PRIMARY_COLOR,
            })
            .textButton({
                label: "Blue x5",
                payload: {
                    command: "bet-double/5"
                },
                color: Keyboard.PRIMARY_COLOR,
            })
            .textButton({
                label: "Green x50",
                payload: {
                    command: "bet-double/50"
                },
                color: Keyboard.PRIMARY_COLOR,
            })
    }

    if (mode === "basketball") {
        keyboard
            .textButton({
                label: "🔴 Красная",
                payload: {
                    command: "bet-basketball/red"
                },
                color: Keyboard.PRIMARY_COLOR,
            })
            .textButton({
                label: "🏀 Ничья",
                payload: {
                    command: "bet-basketball/green"
                },
                color: Keyboard.PRIMARY_COLOR,
            })
            .textButton({
                label: "⚫ Чёрная",
                payload: {
                    command: "bet-basketball/black"
                },
                color: Keyboard.PRIMARY_COLOR,
            })
    }

    if (mode === 'wheel') {
        keyboard.textButton({
            label: '0',
            payload: {
                command: 'rate_noteven'
            },
        })
        keyboard.textButton({
            label: 'Баланс',
            payload: {
                command: 'balance'
            },
            color: Keyboard.SECONDARY_COLOR
        })

        keyboard.row()

        keyboard.textButton({
            label: 'Красное',
            payload: {
                command: 'rate_red'
            },
        })
        keyboard.textButton({
            label: 'На число',
            payload: {
                command: 'rate_dnumber'
            },
        })
        keyboard.textButton({
            label: 'Черное',
            payload: {
                command: 'rate_black'
            },
        })

        keyboard.row()

        keyboard.textButton({
            label: '1-12',
            payload: {
                command: 'rate_int112'
            },
        })
        keyboard.textButton({
            label: '13-24',
            payload: {
                command: 'rate_int1324'
            },
        })
        keyboard.textButton({
            label: '25-36',
            payload: {
                command: 'rate_int2536'
            },
        })

        keyboard.row()

        keyboard.textButton({
            label: 'Четное',
            payload: {
                command: 'rate_even'
            },
        })
        keyboard.textButton({
            label: 'Нечетное',
            payload: {
                command: 'rate_noteven'
            },
        })
    }

    keyboard.row()

    return keyboard
}