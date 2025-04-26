import File from '../models/file.js'

// Добавление информации о файле в базу данных MongoDB
export const uploadFile = async (req, res, next) => {
    const userId = req.user.id;
    
    try {
        const fileData = new File({
            userId,
            fileName: req.file.filename,
            encoding: req.file.encoding,
            mimeType: req.file.mimetype,
            destination: req.file.destination,
            path: req.file.path,
            size: req.file.size,
        });
        await fileData.save();

        next()
    } catch (error) {
        res.status(500).json({ success: false, error: `Error: ${error}` });
    }
}