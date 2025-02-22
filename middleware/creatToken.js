import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../config/appConfig.js'

export const creatToken = async (req, res) => {
    const token = jwt.sign({ id: req.id, username: req.name }, SECRET_KEY, {
        expiresIn: '90d',
    });
    
    res.cookie('token', token, {
        httpOnly: false,
        secure: false, // true для HTTPS
        sameSite: 'Strict',
    });
}