import Folder from "../models/folder.js";
import File from "../models/file.js";
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/appConfig.js'

// Проврека папки на общий доступ
export const accessCheck = async (req, res) => {
    const userId = req.user.id
    const folderId = req.body.itemId

    try {
        const folder = await Folder.find({ userId, _id: folderId })
        const { publicAccess, destination } = folder[0]
        const rootFolder = destination.split('\\')

        if(rootFolder.length > 2) {
            return res.status(200).json({ success: true, message: 'Данная папка не может быть публичной. Предоставить доступ к папке можно лишь в корне профиля.'})
        }

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
        const folder = await Folder.find({ userId, _id: folderId })
        const { path } = folder[0]
        const pathRegex = new RegExp(`^${path.replace(/\\/g, '\\\\')}`);
        const files = await File.find({ userId, path: { $regex: `^${path.replace(/\\/g, '\\\\')}`} })
        // const folders = await Folder.find({ userId, path: { $regex: `^${path.replace(/\\/g, '\\\\')}`} })
        if(files.length >= 1) {
            await File.updateMany(
                {
                    userId,
                    path: { $regex: pathRegex }
                },
                {
                    $set: {
                        publicAccess: status
                    }
                }
            )
        }
        // if(folders.length >= 2) {
        //     await Folder.updateMany(
        //         {
        //             userId,
        //             path: { $regex: pathRegex }
        //         },
        //         {
        //             $set: {
        //                 publicAccess: status
        //             }
        //         }
        //     )
        // }

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
        const folder = await Folder.findById(folderId)
        const { path } = folder
        // const pathRegex = new RegExp(`^${path.replace(/\\/g, '\\\\')}`);
        
        const alreadyHasAccess = folder.userWithAccess.includes(userId);
        if (alreadyHasAccess) {
            return res.redirect(`/${username}`);
        }

        await Folder.updateOne({ _id: folderId }, { $push: { userWithAccess: userId } })
        await File.updateMany({ destination: path }, { $push: { userWithAccess: userId } })
        
        return res.redirect(`/${username}`);
    } catch (error) {
        res.status(500).json({ success: false, error: `Error: ${error}` });
    }
}

export const deletePerson = async (req, res) => {
    const userId = req.user.id
    const { personId, folderId } = req.body
    
    try {
        const folder = await Folder.find({ _id: folderId })
        const { path } = folder[0]

        await Folder.updateOne({ userId, _id: folderId }, { $pull: { userWithAccess: personId } })
        await File.updateMany({ destination: path }, { $pull: { userWithAccess: personId } })
        
        res.status(200).json({ success: true, personId });
    } catch (error) {
        res.status(500).json({ success: false, error: `Error: ${error}` });
    }
}