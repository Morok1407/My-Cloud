import Folder from '../models/folder.js'
import File from '../models/file.js';
import User from '../models/user.js'
import { __filename, __dirname} from '../config/appConfig.js'

export const showDataSet = async (req, res) => {
    const pageNow = req.body.pageNow
    const arrPage = pageNow.split("/");
    const removePage = arrPage.shift()
    req.arrPage = arrPage;

    if(arrPage.length <= 1 && typeof(req.body.folderId) === 'undefined') {
        userDataSet(req, res)
    } else {
        showDataSetToFolder(req, res)
    }
}

async function userDataSet(req, res) {
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
    const folderId = req.body.folderId
    const arrPage = req.arrPage;
    if(arrPage.length >= 2) {
        const folder_NameBefore = arrPage[arrPage.length - 1];
        const folder_Name = decodeURIComponent(folder_NameBefore)
        const folderNameBefore = folder_Name.replace(/_/g, " ")
        const folderName = decodeURIComponent(folderNameBefore)
        const folder = await Folder.find({ userId, folderName });
        const { path } = folder
        if(folder.length >= 1) {
            try {
                const folders = await Folder.find({ userId, destination: path });
                const files = await File.find({ userId, destination: path });
                
                res.status(200).json({ success: true, folders, files, folderName, folder_Name });
            } catch(error) {
                res.status(500).json({ success: false, error: `Error: ${error}` });
            }
        } else {
            res.status(404).json({ success: false, error: 'Данной папки не существует' });
        }
    } else {
        try {
            const folder = await Folder.find({ _id: folderId });
            const { folderName, path } = folder[0]
            const folder_Name = folderName.replace(/\s/g, '_')
            const folders = await Folder.find({ userId, destination: path });
            const files = await File.find({ userId, destination: path });
            
            res.status(200).json({ success: true, folders, files, folderName, folder_Name });
        } catch(error) {
            res.status(500).json({ success: false, error: `Error: ${error}` });
        }
    }
}