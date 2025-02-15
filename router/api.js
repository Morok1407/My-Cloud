import express from 'express'
import { getCaptcha } from '../controllers/captchaController.js'
import { authenticate } from '../middleware/authentication.js'
import { creatFolder, showFolders } from '../controllers/folderController.js';

const router = express.Router()

router.get('/captcha', getCaptcha);

router.post('/creatFolder', authenticate, creatFolder)

router.post('/showFolders', authenticate, showFolders)

export default router