import User from '../models/user.js';
import bcrypt from "bcrypt";
import fs from 'fs'
import path from 'path'
import { creatToken } from '../middleware/creatToken.js'
import { __filename, __dirname } from '../config/appConfig.js'

export const register = async (req, res) => {
    const { name, email, password, rePassword, captchaResponse } = req.body;

    if (password !== rePassword) {
        return res.json({ success: false, message: 'Пароли не совпадают' });
    }

    if (captchaResponse !== req.session.captcha) {
        return res.json({ success: false, message: 'Неверный код с картинки' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.json({ success: false, message: 'Пользователь с таким email уже существует' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });

    try {
        creatToken(newUser, res)

        await newUser.save();
        
        const userId = newUser._id.toString();
        const relativePath = path.join('uploads', userId);
        const absolutePath = path.join(__dirname, '..', relativePath);
        if (!fs.existsSync(absolutePath)) {
            fs.mkdirSync(absolutePath, { recursive: true });
        }
        
        newUser.folderPath = relativePath;
        await newUser.save();
        res.json({ success: true, message: '/assets/template/profile.html'});
    } catch (err) {
        res.json({ success: false, message: 'Ошибка при регистрации: ' + err.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
    if(!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Неверный пароль' });
    }

    try {
        if (!req.cookies || !req.cookies.token) {
            creatToken(user, res);
        }
        
        res.json({ success: true, message: '/assets/template/profile.html'});
    } catch (err) {
        res.json({ success: false, message: 'Ошибка при входе: ' + err.message });
    }
}