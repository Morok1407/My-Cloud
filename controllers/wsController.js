import { wsCreateFolder, wsShowFolders } from "../router/ws.js";

export const wsController = async (wss) => {
    wss.on("connection", (ws) => {
        ws.on('message', (message) => {
            try {
                const parsedMessage = JSON.parse(message)

                switch(parsedMessage.action) {
                    case 'showFolders':
                        wsShowFolders(parsedMessage, ws)
                        break;
                    case 'createFolder':
                        wsCreateFolder(parsedMessage, ws)
                        break;
                    default: 
                        console.log('Не указан action')
                }
            } catch (error) {
                console.error('Ошибка при обработке сообщения:', error);
            }
        })
    });
}
