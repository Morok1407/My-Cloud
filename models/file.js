import mongoose from 'mongoose';

const FileShema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    filename: {
        type: String,
        required: true,
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