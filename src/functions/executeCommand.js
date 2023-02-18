import { commandsList } from "../../main.js"

export const executeCommand = (command, message, data) => {
    const _command = commandsList.find(cmd => cmd.command === command)

    if (_command) {
        _command.handler(message, data)

        /**
         * если у сообщении был найден payload, значит у команды обязательно должно
         * быть поле command с такой же командой, как в payload чтобы обработать команду,
         * а также в handler опционально могут быть добавлены кастомные данные
         */
    }
}