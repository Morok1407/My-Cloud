import File from "../models/file.js"

// Фукнция для скачивания файлов пользователем
export const downloadFile = async (req, res) => {
    const userId = req.user.id
    const fileId = req.params.fileId

    try {
        const file = await File.find({ userId, _id: fileId})
        const { filename, path } = file[0]

        res.download(path, filename);
    } catch (error) {
        res.status(500).json({ success: false, error: `Error: ${error}` });
    }
} 