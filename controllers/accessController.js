import Folder from "../models/folder.js";
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/appConfig.js'

// Проврека папки на общий доступ
export const accessCheck = async (req, res) => {
    const userId = req.user.id
    const folderId = req.body.itemId

    try {
        const folder = await Folder.find({ userId, _id: folderId })
        const { publicAccess } = folder[0]
        console.log(folder)

        res.status(200).json({ success: true, publicAccess });
    } catch (error) {
        res.status(500).json({ success: false, error: `Error: ${error}` });
    }
}

// Предоставление общего доступа к папке и наоборот
export const accessChange = async (req, res, next) => {
    const userId = req.user.id
    const { folderId, status } = req.body

    try {
        await Folder.updateOne({ userId, _id: folderId }, { $set: { publicAccess: status } })

        next()
    } catch (error) {
        res.status(500).json({ success: false, error: `Error: ${error}` });
    }
}

// Предоставление доступа
export const grantingAccess = async (req, res) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        
    if (!token) {
        return res.redirect("/assets/template/register.html");
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    const { username, id: userId } = decoded
    const folderId = req.params.folderId

    try {
        await Folder.updateOne({ _id: folderId }, { $push: { userWithAccess: userId } })

        return res.redirect(`/${username}`);
    } catch (error) {
        res.status(500).json({ success: false, error: `Error: ${error}` });
    }
}