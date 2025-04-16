import fs from 'fs'
import File from '../models/file.js'
import Folder from '../models/folder.js'

export const rename = async (req, res, next) => {
    const userId = req.user.id
    const { itemId, itemType } = req.body;
    let { renameText: newName } = req.body;

    try {
        if(itemType === 'Folder') {
            const folder = await Folder.find({ userId, _id: itemId })
            const { folderName, path } = folder[0]
            let arrPath = path.split('\\')
            arrPath.pop()
            let newPath = `${arrPath.join('\\')}\\${newName}`
            if(folderName === newName) {
                res.status(500).json({ success: true, message: 'Not difference' });
            } else {
                try {
                    fs.accessSync(newPath);
                    res.status(500).json({ success: false, error: `Папка с таким именем уже существует` });
                } catch {
                    fs.renameSync(path, newPath)
                    await Folder.updateOne({ userId, _id: itemId }, { $set: { folderName: newName, path: newPath } })
                    next()
                }
            }
        } else {
            const file = await File.find({ userId, _id: itemId })
            const { fileName, path } = file[0]
            const extension = fileName.substring(fileName.lastIndexOf('.') + 1)
            let arrPath = path.split('\\')
            arrPath.pop()
            newName += `.${extension}`
            let newPath = `${arrPath.join('\\')}\\${newName}`
            if(fileName === newName) {
                res.status(500).json({ success: true, message: 'Not difference' });
            } else {
                try {
                    fs.accessSync(newPath);
                    res.status(500).json({ success: false, error: `Файл с таким именем уже существует` });
                } catch {
                    fs.renameSync(path, newPath)
                    await File.updateOne({ userId, _id: itemId }, { $set: { fileName: newName, path: newPath } })
                    next()
                }
            }
        }
    } catch (error) {
        res.status(500).json({ success: false, error: `Error: ${error}` });
    }
}