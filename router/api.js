import express from 'express'
import { getCaptcha } from '../controllers/captchaController.js'

const router = express.Router()

router.get('/captcha', getCaptcha);

export default router