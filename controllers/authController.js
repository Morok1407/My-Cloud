// Импорт необходимых модулей, библиотек и функций
import User from '../models/user.js';
import bcrypt from "bcrypt";
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { creatToken } from '../middleware/creatToken.js'
import { __filename, __dirname } from '../config/appConfig.js'
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/appConfig.js'
import nodemailer from 'nodemailer';
import { MAIL, MAILPASS } from '../config/appConfig.js';

// Регистрация пользователя
export const register = async (req, res) => {
    const { name, email, password, rePassword } = req.body;

    if (password !== rePassword) {
        return res.json({ success: false, message: 'Пароли не совпадают' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.json({ success: false, message: 'Пользователь с таким email уже существует' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(3).toString("hex").toUpperCase();
    
    const newUser = new User({ name, email, password: hashedPassword, verificationToken });
    
    try {
        creatToken(newUser, res)

        const userId = newUser._id.toString();
        const relativePath = path.join('uploads', userId);
        const absolutePath = path.join(__dirname, '..', relativePath);
        if (!fs.existsSync(absolutePath)) {
            fs.mkdirSync(absolutePath, { recursive: true });
        }
        
        newUser.folderPath = relativePath;

        await newUser.save();
        await sendVerificationEmail(newUser);
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

// Вход пользователя
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

        const verificationToken = crypto.randomBytes(3).toString("hex").toUpperCase();
        await User.updateOne({ _id: user._id }, { $set: { verificationToken } })
        const userUpdated = await User.find({ _id: user._id })
        if(!userUpdated[0].isVerified) {
            await sendVerificationEmail(userUpdated[0]);
            return res.json({ success: false, message: `Not verification` });
        }
        
        res.json({ success: true, message: `/${user.name}` });
    } catch (err) {
        res.json({ success: false, message: 'Ошибка при входе: ' + err.message });
    }
}

// Создание и отправка Email письма
export const sendVerificationEmail = async (user) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        post: 465,
        secure: true,
        auth: {
            user: MAIL,
            pass: MAILPASS
        },
    });

    const mailOptions = {
        from: `SkyBin <${MAIL}>`,
        to: user.email,
        subject: "Подтверждение почты",
        html: `<h2>Подтвердите свою почту</h2>
                <p>Код для подтверждения:</p>
                <span>${user.verificationToken}</span>`
            };
            
    transporter.sendMail(mailOptions, (err, info) => {
        if(err) return console.error(err)
        console.log(`Email sent ${info}`)
    });
}

// Проверка кода отправленного на почту
export const verifyEmail = async (req, res) => {
    const code = req.body.code
    const userId = req.user.id

    try {
        const user = await User.findOne({ _id: userId, verificationToken: code });

        if (!user) {
            return res.status(404).json({ error: "Токен не найден." });
        }

        user.isVerified = true;
        user.verificationToken = "";
        await user.save();

        res.status(200).json({ success: true, message: `/${user.name}` });
    } catch (error) {
        res.status(500).json({ success: false, error: "Ошибка подтверждения почты." });
    }
};

// Открытие пользовательской странцы
export const openUserProfile = async (req, res) => {
    const name = req.params.username
    try {
        const user = await User.findOne({ name });

        if (user) {
            return res.sendFile(path.join(__dirname, "..", "public", "assets", "template", "Profile.html"));
        }
    } catch (error) {
        res.status(500).send(`${error}`);
    }
}

export const checkToken = async (req, res) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.redirect("/assets/template/register.html");
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    const userName = decoded.username
    const user = await User.findById(decoded.id)

    if(user === null) {
        return res.redirect("/assets/template/register.html");
    }
    
    if(!user.isVerified) {
        return res.redirect("/assets/template/register.html");
    }
    
    try {
        return res.redirect(`/${userName}`);
    } catch (error) {
        res.status(500).json({ success: false, error: `Error: ${error}` });
    }
}

export const checkVerificat = async (req, res) => {
    const userId = req.user.id

    try {
        const verificationToken = crypto.randomBytes(3).toString("hex").toUpperCase();
        await User.updateOne({ _id: userId }, { $set: { verificationToken } })
        const user = await User.find({ _id: userId })
        if(!user[0].isVerified) {
            await sendVerificationEmail(user[0]);
            return res.json({ success: false, message: `Not verification` });
        }

        res.json({ success: true });
    } catch (error) {
        res.status(200).json({ success: true });
    }
}