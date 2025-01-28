import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    path: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' }
});

const File = mongoose.model('File', FileSchema)

export default File;