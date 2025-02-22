import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/appConfig.js'

export const authenticate = (req, ws) => {
    const token = req.token;

    if (!token) {
        return 'Требуется аутентификация';
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded
    } catch (error) {
        ws.on('error', error => {
            ws.send(error)
        })
    }
};