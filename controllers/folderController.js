import fs from 'fs'
import path from 'path'
import Folder from '../models/folder.js'
import { __filename, __dirname} from '../config/appConfig.js'

export const creatFolder = async (req, res) => {
    const userId = req.user.id;
    const { folderName } = req.body;

    folderName.trim().toUpperCase()

    if (!folderName) {
        return res.status(400).json({ error: 'Папка не названа' });
    }

    if(folderName.length >= 25) {
        return res.status(400).json({error: 'Черезмерно длинное название'})
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
    
        res.status(201).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Ошибка сервера' });
    }
}

export const showFolders = async (req, res) => {
    const userId = req.user.id;

    try {
        const folders = await Folder.find({ userId });
        res.json(folders);
    } catch {
        res.status(500).json({ message: "Ошибка сервера" });
    }
}