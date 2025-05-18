// Импорт необходимых модулей, библиотек и функций
import express from 'express'
import { register, login, verifyEmail, checkVerificat } from '../controllers/authController.js'
import { authenticate } from '../middleware/authentication.js'

const router = express.Router()

// Создание API ключей для аутентификации пользователя
router.post('/register', register)
router.post('/login', login)
router.post('/codeConfirm', authenticate, verifyEmail)
router.post('/checkVerificat', authenticate, checkVerificat)

export default router