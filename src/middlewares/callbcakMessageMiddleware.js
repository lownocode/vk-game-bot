import { commandsList } from "../main.js"

export const callbackMessageMiddleware = async (message) => {
    const callbackCommands = commandsList.filter(cmd => cmd.callbackCommand)
    const payloadCommand = message.eventPayload.command.split("_")
    const command = callbackCommands.find(cmd => cmd.callbackCommand === payloadCommand[0])

    if (command) {
        command.handler(message, payloadCommand)
    }
}