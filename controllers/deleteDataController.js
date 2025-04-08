import fs from 'fs'
import { __dirname, __filename } from '../config/appConfig.js'
import Folder from '../models/folder.js'
import File from '../models/file.js'

export const deleteFile = async (req, res, next) => {
    const userId = req.user.id
    const fileId = req.body.fileId

    try {
        const file = await File.find({ userId, _id: fileId})
        const { path: filePath } = file[0]

        fs.unlink(filePath, (error) => {
            if (error) {
                res.status(500).json({ success: false, error: error });
            }
        });
        await File.deleteOne({ userId, _id: fileId})

        next()
    } catch (error) {
        res.status(500).json({ success: false, error: `Error: ${error}` });
    }   
}

export const deleteFolder = async (req, res, next) => {
    const userId = req.user.id
    const folderId = req.body.folderId

    try {
        const folder = await Folder.find({ userId, _id: folderId})
        const { path: folderPath } = folder[0]
        const folders = await Folder.find({ userId, path: { $regex: `^${folderPath.replace(/\\/g, '\\\\')}`} })
        const files = await File.find({ userId, path: { $regex: `^${folderPath.replace(/\\/g, '\\\\')}`} })
        
        if(folders.length >= 2 || files.length >= 1) {
            fs.rm(folderPath, { recursive: true, force: true }, (error) => {
                if (error) {
                    res.status(500).json({ success: false, error: error });
                }
            });
            await Folder.deleteMany({ userId, path: { $regex: `^${folderPath.replace(/\\/g, '\\\\')}`} })
            await File.deleteMany({ userId, path: { $regex: `^${folderPath.replace(/\\/g, '\\\\')}`} })
        } else {
            fs.rmdir(folderPath, (error) => {
                if (error) {
                    res.status(500).json({ success: false, error: `Error: ${error}` });
                }
            });
            await Folder.deleteOne({ userId, _id: folderId})
        }

        next()
    } catch (error) {
        if(!(error == 'TypeError: Cannot destructure property \'path\' of \'folder[0]\' as it is undefined.')) {
            res.status(500).json({ success: false, error: `Error: ${error}` });
        }
    }   
}