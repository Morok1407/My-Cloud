import Folder from '../models/folder.js'
import File from '../models/file.js';
import User from '../models/user.js'
import { __filename, __dirname} from '../config/appConfig.js'

export const showDataSet = async (req, res) => {
    const urlParams_F = req.body.urlParams_F
    if(urlParams_F && !(urlParams_F === 'null')){
        showDataSetToFolder(req, res)
    } else {
        showDataSetUser(req, res)
    }
}

async function showDataSetUser(req, res) {
    const _id = req.user.id;
    try {
        const user = await User.find({ _id });
        const { name, folderPath } = user[0];

        const folders = await Folder.find({ userId: _id, destination: folderPath });
        const files = await File.find({ userId: _id, destination: folderPath });

        res.status(200).json({ success: true, folders, files, name});
    } catch(error) {
        res.status(500).json({ success: false, error: `Error: ${error}` });
    }
}

export const showDataSetToFolder = async (req, res) => {
    const userId = req.user.id;
    const urlParams_F = req.body.urlParams_F.replace(/"/g, '')
    try {
        const folder = await Folder.find({ userId, _id: urlParams_F })
        const { folderName, path } = folder[0]
        const folders = await Folder.find({ userId, destination: path });
        const files = await File.find({ userId, destination: path });

        res.status(200).json({ success: true, folders, files, folderName });
    } catch (error) {
        res.status(500).json({ success: false, error: `Error: ${error}` });
    }
}