import mongoose from "mongoose";

// Инициализация таблицы папок в базе данных MongoDB
const FolderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    folderName: {
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
    mimeType: String,
    destination: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Folder = mongoose.model('Folder', FolderSchema)

export default Folder;