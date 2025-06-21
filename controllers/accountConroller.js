import User from "../models/user.js";
import File from "../models/file.js";
import Folder from "../models/folder.js";
import bcrypt from "bcrypt";
import fs from 'fs'
import { __filename, __dirname, SECRET_KEY, MAIL, MAILPASS } from '../config/appConfig.js'
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

export const changeName = async (req, res) => {
    const userId = req.user.id
    const { password, newName } = req.body
    const oldUser = await User.findById(userId)
    const isPasswordValid = await bcrypt.compare(password, oldUser.password)

    if(!isPasswordValid) {
        return res.status(401).json({ success: false, error: 'Неверный пароль' });
    }

    try {        
        await User.updateOne({ _id: userId }, { name: newName })
        const user = await User.findById(userId)
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, error: `Error: ${error}` });
    }
}

export const changeEmail = async (req, res) => {
    const userId = req.user.id
    const { password, newEmail } = req.body
    const oldUser = await User.findById(userId)
    const isPasswordValid = await bcrypt.compare(password, oldUser.password)

    if(!isPasswordValid) {
        return res.status(401).json({ success: false, error: 'Неверный пароль' });
    }

    try {        
        await User.updateOne({ _id: userId }, { email: newEmail, isVerified: false })
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: `Error: ${error}` });
    }
}

export const changePassword = async (req, res) => {
    const userId = req.user.id
    const { oldPassword, newPassword, reNewPassword } = req.body

    if (newPassword !== reNewPassword) {
        return res.json({ success: false, error: 'Новые пароли не совпадают' });
    }

    if(newPassword.length < 6) {
        return res.json({ success: false, error: 'Пароль должен содержать больше 6 символов' })
    }

    const user = await User.findById(userId)
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password)

    if(!isPasswordValid) {
        return res.status(401).json({ success: false, error: 'Неверный старый пароль' });
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.updateOne({ _id: userId }, { password: hashedPassword })
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: `Error: ${error}` });
    }
}