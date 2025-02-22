import { authenticate } from "../middleware/authentication.js"
import { showFolders } from "../controllers/folderController.js"
import { creatFolder } from "../controllers/folderController.js"

export const wsShowFolders = async (data, ws) => {
    const token = authenticate(data, ws)
    data.user = token
    showFolders(data, ws)
}

export const wsCreateFolder = async (data, ws) => {
    const token = authenticate(data, ws)
    data.user = token
    creatFolder(data, ws)
}