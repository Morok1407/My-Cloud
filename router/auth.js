import express from 'express'
import { getCaptcha } from '../controllers/captchaController.js'
import { register, login } from '../controllers/authController.js'

const router = express.Router()

router.get('/captcha', getCaptcha);
router.post('/register', register)
router.post('/login', login)

export default router