import express from 'express'
import { getCaptcha } from '../controllers/captchaController.js'
import { creatFolder } from '../controllers/folderController.js';
import { authenticate } from '../middleware/authentication.js'

const router = express.Router()

router.get('/captcha', getCaptcha);

router.post('/creatFolder', authenticate, creatFolder)

export default router