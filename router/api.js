// Импорт необходимых модулей, библиотек и функций
import express from 'express'
import upload from '../config/multerConfig.js';
import { uploadHandler } from '../config/multerConfig.js';
import { __dirname } from '../config/appConfig.js';
import { authenticate } from '../middleware/authentication.js'
import { showDataSet, showDataSetToFolder, showDataInfoFile, showDataInfoFolder, searchData } from '../controllers/showDataSet.js';
import { creatFolder } from '../controllers/folderController.js';
import { uploadFile } from '../controllers/fileController.js';
import { rename } from '../controllers/renameController.js';
import { deleteFile, deleteFolder } from '../controllers/deleteDataController.js';
import { downloadFile } from '../controllers/downloadController.js';

const router = express.Router()

// Создание API ключей
router.post('/showDataSet', authenticate, showDataSet)

router.post('/showDataSetToFolder', authenticate, showDataSetToFolder)

router.post('/creatFolder', authenticate, creatFolder, showDataSet)

router.post('/uploadFile', authenticate, upload, uploadHandler, uploadFile, showDataSet)

router.post('/rename', authenticate, rename, showDataSet)

router.post('/infoFile', authenticate, showDataInfoFile)

router.post('/infoFolder', authenticate, showDataInfoFolder)

router.post('/deleteFile', authenticate, deleteFile, showDataSet)

router.post('/deleteFolder', authenticate, deleteFolder, showDataSet)

router.post('/searchData', authenticate, searchData)

router.get('/downloadFile/:fileId', authenticate, downloadFile)

export default router