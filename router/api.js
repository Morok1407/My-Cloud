import express from 'express'
import path from 'path'
import { __dirname } from '../config/appConfig.js';
import { authenticate } from '../middleware/authentication.js'
import { showDataSet } from '../controllers/showDataSet.js';
import { creatFolder } from '../controllers/folderController.js';
import { uploadFile } from '../controllers/fileController.js';
import { uploadHandler } from '../config/multerConfig.js';
import upload from '../config/multerConfig.js';

const router = express.Router()

router.get("/user", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "assets", "template", "Profile.html"));
});

router.post('/showDataSet', authenticate, showDataSet)

router.post('/creatFolder', authenticate, creatFolder, showDataSet)

router.post('/uploadFile', authenticate, upload, uploadHandler, uploadFile, showDataSet)

export default router