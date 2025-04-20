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
                    const folders = await Folder.find({ userId, path: { $regex: `^${path.replace(/\\/g, '\\\\')}`} })
                    const files = await File.find({ userId, path: { $regex: `^${path.replace(/\\/g, '\\\\')}`} })
                    const pathRegex = new RegExp(`^${path.replace(/\\/g, '\\\\')}`);

                    // На Windows 11 не работает переименование папок внутри которых есть другие папки
                    // Заметка: "Изменить при переходе на другую OS"
                    fs.renameSync(path, newPath)
                    await Folder.updateOne(
                        { userId, _id: itemId }, 
                        { $set: { folderName: newName, path: newPath } }
                    )
                    
                    if(files.length >= 1) {
                        await File.updateMany(
                            { 
                                userId,
                                path: { $regex: pathRegex }
                            },
                            [{
                            $set: {
                                path: {
                                $concat: [
                                    newPath,
                                    { $substr: ["$path", {$strLenBytes: path}, {$strLenBytes: "$path"}] }
                                ]
                                },
                                destination: {
                                $concat: [
                                    newPath,
                                    { $substr: ["$destination", {$strLenBytes: path}, {$strLenBytes: "$destination"}] }
                                ]
                                }
                            }
                            }]
                        );
                    }
                    if(folders.length >= 2) {
                        await Folder.updateMany(
                            { 
                                userId,
                                path: { $regex: pathRegex }
                            },
                            [{
                            $set: {
                                path: {
                                $concat: [
                                    newPath,
                                    { $substr: ["$path", {$strLenBytes: path}, {$strLenBytes: "$path"}] }
                                ]
                                },
                                destination: {
                                $concat: [
                                    newPath,
                                    { $substr: ["$destination", {$strLenBytes: path}, {$strLenBytes: "$destination"}] }
                                ]
                                }
                            }
                            }]
                        );
                    }
                    next()
                }
            }
        } else {
            const file = await File.find({ userId, _id: itemId })
            const { fileName, path } = file[0]
            const extension = fileName.substring(fileName.lastIndexOf('.') + 1)
            let arrPath = path.split('\\')
            arrPath.pop()
            if(fileName === newName) {
                res.status(500).json({ success: true, message: 'Not difference' });
            } else {
                newName += `.${extension}`
                let newPath = `${arrPath.join('\\')}\\${newName}`
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