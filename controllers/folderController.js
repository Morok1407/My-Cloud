// Импорт необходимых модулей, библиотек и функций
import fs from 'fs'
import path from 'path'
import Folder from '../models/folder.js'
import { __filename, __dirname} from '../config/appConfig.js'

// Создание папки пользователем
export const creatFolder = async (req, res, next) => {  
    const userId = req.user.id;
    const { folderName, urlParams_F } = req.body;

    folderName.trim().toUpperCase()

    if (!folderName) {
        return res.status(400).json({ success: false, error: 'Папка не названа' });
    }

    if(folderName.length >= 25) {
        return res.status(400).json({ success: false, error: 'Черезмерно длинное название'})
    }

    if(!(urlParams_F === null)) {
        try {
            const folder = await Folder.find({ userId, _id: urlParams_F })
            const { path: parentFolderPath } = folder[0]
            const newFolderPath = path.join(parentFolderPath, folderName);

            if (!fs.existsSync(newFolderPath)) {
                fs.mkdirSync(newFolderPath); 
            } else {
                return res.status(400).json({ success: false, error: 'Такая папка уже существует' });
            }

            const newFolder = new Folder({
                userId,
                folderName: folderName,
                mimeType: 'Folder',
                destination: parentFolderPath,
                path: newFolderPath,
                createdAt: new Date(),
            });
        
            await newFolder.save();
            next()   
        } catch (error) {
            res.status(500).json({ success: false, error: `Error: ${error}` });
        }
    } else {
        try {
            const userFolderPath = path.join('uploads', userId);
            const newFolderPath = path.join(userFolderPath, folderName);
    
            if (!fs.existsSync(userFolderPath)) {
                fs.mkdirSync(userFolderPath, { recursive: true }); 
            }
    
            if (!fs.existsSync(newFolderPath)) {
                fs.mkdirSync(newFolderPath); 
            } else {
                return res.status(400).json({ success: false, error: 'Такая папка уже существует' });
            }
    
            const newFolder = new Folder({
                userId,
                folderName: folderName,
                userWithAccess: userId,
                mimeType: 'Folder',
                destination: userFolderPath,
                path: newFolderPath,
                createdAt: new Date(),
            });
        
            await newFolder.save();
            next()    
        } catch (error) {
            res.status(500).json({ success: false, error: `Error: ${error}` });
        }
    }
}