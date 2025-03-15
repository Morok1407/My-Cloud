import Folder from '../models/folder.js'
import File from '../models/file.js';
import { __filename, __dirname} from '../config/appConfig.js'

export const showDataSet = async (req, res) => {
    const userId = req.user.id;
    
    try {
        const folders = await Folder.find({ userId });
        const files = await File.find({ userId });
        
        res.status(200).json({ success: true, folders, files });
    } catch(error) {
        res.status(500).json({ success: false, error: `Error: ${error}` });
    }
}