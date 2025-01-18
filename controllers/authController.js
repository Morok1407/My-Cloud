import User from '../models/user.js';
import bcrypt from "bcrypt";

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
        await newUser.save();
        res.json({ success: true, message: 'Регистрация успешна!' });
    } catch (err) {
        res.json({ success: false, message: 'Ошибка при регистрации: ' + err.message });
    }
};