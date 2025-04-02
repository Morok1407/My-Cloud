import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/appConfig.js'

export const authenticate = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Требуется аутентификация' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        
        next();
    } catch (error) {
        res.status(403).json({ error: 'Недействительный или просроченный токен' });
    }
};