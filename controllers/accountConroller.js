import User from "../models/user.js";
import File from "../models/file.js";
import Folder from "../models/folder.js";
import bcrypt from "bcrypt";
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { creatToken } from '../middleware/creatToken.js'
import { __filename, __dirname, SECRET_KEY, MAIL, MAILPASS } from '../config/appConfig.js'
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export const deleteAccount = async (req, res) => {
    const userId = req.user.id
    const password = req.body.password
    const user = await User.findById(userId)
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid) {
        return res.status(401).json({ success: false, error: 'Неверный пароль' });
    }

    try {        
        fs.rm(user.folderPath, { recursive: true, force: true }, (error) => {
            if (error) {
                res.status(500).json({ success: false, error: `Error: ${error}` });
            }
        });
        await Folder.deleteMany({ userId, path: { $regex: `^${user.folderPath.replace(/\\/g, '\\\\')}`} })
        await File.deleteMany({ userId, path: { $regex: `^${user.folderPath.replace(/\\/g, '\\\\')}`} })
        await Folder.updateMany({ userWithAccess: userId }, { $pull: { userWithAccess: userId } })
        await File.updateMany({ userWithAccess: userId }, { $pull: { userWithAccess: userId } })
        await User.deleteOne({ _id: userId })

        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
        });

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: `Error: ${error}` });
    }
}