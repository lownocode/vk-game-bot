export const convertChatMode = (mode, idFormat = true) => {
    switch (idFormat) {
        case true:
            switch (mode) {
                case "кубик": return "dice"
                case "слоты": return "slots"
                case "дабл": return "double"
                case "баскетбол": return "basketball"
                case "вил": return "wheel"
            }

            break
        case false:
            switch (mode) {
                case "dice": return "кубик"
                case "slots": return "слоты"
                case "double": return "double"
                case "basketball": return "баскетбол"
                case "wheel": return "wheel"
                default: return "не выбран"
            }
    }
}