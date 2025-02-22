import fs from 'fs'
import path from 'path'
import Folder from '../models/folder.js'
import { __filename, __dirname} from '../config/appConfig.js'

export const creatFolder = async (req, ws) => {
    const userId = req.user.id;
    const folderName = req.body;

    folderName.trim()

    if (!folderName) {
        ws.on('error', error => {
            ws.send(`Файл не назван ${error}`)
        })
    }

    if(folderName.length >= 25) {
        ws.on('error', error => {
            ws.send(`Длинное называние ${error}`)
        })
    }

    try {
        const userFolderPath = path.join('uploads', userId);
        const newFolderPath = path.join(userFolderPath, folderName);

        if (!fs.existsSync(userFolderPath)) {
            fs.mkdirSync(userFolderPath, { recursive: true }); 
        }

        if (!fs.existsSync(newFolderPath)) {
            fs.mkdirSync(newFolderPath); 
        } else {
            return res.status(400).json({ error: 'Такая папка уже существует' });
        }

        const newFolder = new Folder({
            userId,
            name: folderName,
            path: newFolderPath,
            createdAt: new Date(),
        });
    
        await newFolder.save();
        ws.send(showFolders(req, ws))
    } catch (error) {
        ws.on('error', error => {
            ws.send(error)
        })
    }
}

export const showFolders = async (req, ws) => {
    const userId = req.user.id;

    try {
        const folders = await Folder.find({ userId });
        ws.send(JSON.stringify(folders))
    } catch (error) {
        ws.on('error', error => {
            ws.send(error)
        })
    }
}