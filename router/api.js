import express from 'express'
import upload from '../config/multerConfig.js';
import { uploadHandler } from '../config/multerConfig.js';
import { __dirname } from '../config/appConfig.js';
import { authenticate } from '../middleware/authentication.js'
import { showDataSet, showDataSetToFolder, showDataInfoFile, showDataInfoFolder } from '../controllers/showDataSet.js';
import { creatFolder } from '../controllers/folderController.js';
import { uploadFile } from '../controllers/fileController.js';
import { deleteFile, deleteFolder } from '../controllers/deleteDataController.js';
import { downloadFile } from '../controllers/downloadController.js';

const router = express.Router()

router.post('/showDataSet', authenticate, showDataSet)

router.post('/showDataSetToFolder', authenticate, showDataSetToFolder)

router.post('/creatFolder', authenticate, creatFolder, showDataSet)

router.post('/uploadFile', authenticate, upload, uploadHandler, uploadFile, showDataSet)

router.post('/infoFile', authenticate, showDataInfoFile)

router.post('/infoFolder', authenticate, showDataInfoFolder)

router.post('/deleteFile', authenticate, deleteFile, showDataSet)

router.post('/deleteFolder', authenticate, deleteFolder, showDataSet)

router.get('/downloadFile/:fileId', authenticate, downloadFile)

export default router