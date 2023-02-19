export const convertChatMode = (mode, idFormat = true) => {
    switch (idFormat) {
        case true:
            switch (mode) {
                case "кубик": return "cube"
                case "слоты": return "slots"
                case "дабл": return "double"
                case "баскетбол": return "basketball"
                case "вил": return "wheel"
            }
        case false:
            switch (mode) {
                case "cube": return "кубик"
                case "slots": return "слоты"
                case "double": return "double"
                case "basketball": return "баскетбол"
                case "wheel": return "wheel"
                default: return "не выбран"
            }
    }
}