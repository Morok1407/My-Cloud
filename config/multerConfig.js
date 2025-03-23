import multer from "multer";
import path from "path";
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = req.user.id;
        const uploadPath = `uploads\\${userId}`;

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const safeFilename = Buffer.from(file.originalname, 'latin1').toString('utf8');
        const filePath = path.join(`uploads\\${req.user.id}`, safeFilename);

        if (fs.existsSync(filePath)) {
            req.multerError = { errorMessage: 'Такой файл уже существует'}
        }

        cb(null, safeFilename);
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