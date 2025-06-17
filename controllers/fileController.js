import File from '../models/file.js'
import Folder from '../models/folder.js';

// Добавление информации о файле в базу данных MongoDB
export const uploadFile = async (req, res, next) => {
    const userId = req.user.id;
    const destination = req.file.destination.split("\\");
    
    try {
        if(destination.length > 2) {
            const folder = await Folder.find({ path: req.file.destination })
            const { publicAccess, userWithAccess } = folder[0]
            
            const fileData = new File({
                userId,
                fileName: req.file.filename,
                publicAccess,
                userWithAccess: userWithAccess,
                encoding: req.file.encoding,
                mimeType: req.file.mimetype,
                destination: req.file.destination,
                path: req.file.path,
                size: req.file.size,
            });
            await fileData.save();
        } else {
            const fileData = new File({
                userId,
                fileName: req.file.filename,
                userWithAccess: userId,
                encoding: req.file.encoding,
                mimeType: req.file.mimetype,
                destination: req.file.destination,
                path: req.file.path,
                size: req.file.size,
            });
            await fileData.save();
        }   
        
        next()
    } catch (error) {
        res.status(500).json({ success: false, error: `Error: ${error}` });
    }
}