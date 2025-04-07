import multer from "multer";
import path from "path";
import fs from 'fs';
import Folder from '../models/folder.js'

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const userId = req.user.id
        const urlParams_F = req.body.urlParams_F.replace(/"/g, '')
        if(urlParams_F === 'null'){
            const uploadPath = `uploads\\${userId}`;
            
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }

            cb(null, uploadPath);
        } else {
            const folder = await Folder.find({ userId, _id: urlParams_F })
            const { path: parentFolderPath } = folder[0]
            const uploadPath = `${parentFolderPath}`;
            
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }

            cb(null, uploadPath);
        }
    },
    filename: async (req, file, cb) => {
        const userId = req.user.id
        const urlParams_F = req.body.urlParams_F.replace(/"/g, '')
        if(urlParams_F === 'null') {
            const safeFilename = Buffer.from(file.originalname, 'latin1').toString('utf8');
            const filePath = path.join(`uploads`, safeFilename);
    
            if (fs.existsSync(filePath)) {
                req.multerError = { errorMessage: 'Такой файл уже существует'}
            }
    
            cb(null, safeFilename);
        } else {
            const folder = await Folder.find({ userId, _id: urlParams_F })
            const { path: parentFolderPath } = folder[0]
            const safeFilename = Buffer.from(file.originalname, 'latin1').toString('utf8');
            const filePath = path.join(`${parentFolderPath}\\${userId}`, safeFilename);
    
            if (fs.existsSync(filePath)) {
                req.multerError = { errorMessage: 'Такой файл уже существует'}
            }
    
            cb(null, safeFilename);
        }
    },
});

const upload = multer({ storage }).single('file');

export const uploadHandler = async (req, res, next) => {
    if (req.multerError) {
        res.status(400).json({ success: false, error: req.multerError.errorMessage });
    } else {
        next()
    }
};

export default upload;