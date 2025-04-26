// Импорт необходимых модулей, библиотек и функций
import Folder from '../models/folder.js'
import File from '../models/file.js';
import User from '../models/user.js'
import { __filename, __dirname} from '../config/appConfig.js'

// Проверка запроса на наличие urlParamsFolder
export const showDataSet = async (req, res) => {
    const urlParams_F = req.body.urlParams_F
    if(urlParams_F && !(urlParams_F === 'null')){
        showDataSetToFolder(req, res)
    } else {
        showDataSetUser(req, res)
    }
}

// Предоставление пользователю его данных в корневой папке
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

// Предоставление пользователю данных в папке
export const showDataSetToFolder = async (req, res) => {
    const userId = req.user.id;
    const urlParams_F = req.body.urlParams_F.replace(/"/g, '')
    try {
        const folder = await Folder.find({ userId, _id: urlParams_F })
        const { folderName, path } = folder[0]
        const folders = await Folder.find({ userId, destination: path });
        const files = await File.find({ userId, destination: path });

        res.status(200).json({ success: true, folders, files, folderName, path });
    } catch (error) {
        res.status(500).json({ success: false, error: `Error: ${error}` });
    }
}

// Предоставление пользователю информационных данных о файле
export const showDataInfoFile = async (req, res) => {
    const userId = req.user.id
    const fileId = req.body.itemId
    
    try {
        const file = await File.find({ userId, _id: fileId })
        const user = await User.find({ _id: userId })
        
        res.status(200).json({ success: true, file, user });
    } catch (error) {
        res.status(500).json({ success: false, error: `Error: ${error}` });
    }
}

// Предоставление пользователю информационных данных о папке
export const showDataInfoFolder = async (req, res) => {
    const userId = req.user.id
    const folderId = req.body.itemId
    
    try {
        const folder = await Folder.find({ userId, _id: folderId })
        const user = await User.find({ _id: userId })
        const { path: folderPath } = folder[0]
        const folders = await Folder.find({ userId, path: { $regex: `^${folderPath.replace(/\\/g, '\\\\')}`} })
        const files = await File.find({ userId, path: { $regex: `^${folderPath.replace(/\\/g, '\\\\')}`} })
        const itemLength = {
            foldersLength: folders.length,
            filesLength: files.length
        }
        let sumSizeFiles = 0;
        files.forEach(file => {
            sumSizeFiles += file.size
        });
        
        res.status(200).json({ success: true, folder, user, itemLength, sumSizeFiles });
    } catch (error) {
        res.status(500).json({ success: false, error: `Error: ${error}` });
    }
}

// Поиск пользовательских данных
export const searchData = async (req, res) => {
    const userId = req.user.id
    const searchValue = req.body.searchInput
    
    if(searchValue === '') {
        showDataSet(req, res)
    } else {
        const escapedValue = searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
        try {
            const searchRegex = new RegExp(escapedValue, 'i');
            const folders = await Folder.find({ userId, folderName: searchRegex })
            const files = await File.find({ userId, fileName: searchRegex })

            res.status(200).json({ success: true, folders, files });
        } catch (error) {
            res.status(500).json({ success: false, error: `Error: ${error}` });
        }
    }
}