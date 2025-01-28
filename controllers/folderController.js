import fs from 'fs'
import path from 'path'
import Folder from '../models/folder.js'
import { __filename, __dirname} from '../config/appConfig.js'

export const creatFolder = async (req, res) => {
    const userId = req.user.id;
    console.log(userId)
    const { folderName } = req.body;

    if (!folderName) {
        return res.status(400).json({ error: 'Папка не названа' });
    }

    try {
        const userFolderPath = path.join(__dirname, '..', 'uploads', userId);
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
    
        res.status(201).json({ success: true, message: `Папка ${folderName} создана` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Ошибка сервера' });
    }
}