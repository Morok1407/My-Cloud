import mongoose from 'mongoose';

// Инициализация таблицы файлов в базе данных MongoDB
const FileShema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    fileName: {
        type: String,
        required: true,
    },
    publicAccess: {
        type: Boolean,
        default: false,
    },
    userWithAccess: {
        type: [String],
        ref: 'User',
    },
    encoding: String,
    mimeType: String,
    destination: String,
    path: {
        type: String,
        required: true,
    },
    size: Number,
    uploadedAt: { type: Date, default: Date.now },
})

const File = mongoose.model('File', FileShema)

export default File