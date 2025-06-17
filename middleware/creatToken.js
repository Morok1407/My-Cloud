import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../config/appConfig.js'

// Создание и отправка токена пользователю
export const creatToken = async (req, res) => {
    const token = jwt.sign({ id: req.id, username: req.name }, SECRET_KEY, {
        expiresIn: '30d',
    });
    
    res.cookie('token', token, {
        httpOnly: true,
        secure: false, // true для HTTPS
        sameSite: 'Strict',
    });
}

export const logOutOfAccount = async(req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
    });
    res.redirect("/register");
}