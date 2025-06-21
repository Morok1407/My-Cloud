// Импорт необходимых модулей, библиотек и функций
import express from 'express'
import upload from '../config/multerConfig.js';
import { uploadHandler } from '../config/multerConfig.js';
import { __dirname } from '../config/appConfig.js';
import { authenticate } from '../middleware/authentication.js'
import { logOutOfAccount } from '../middleware/creatToken.js';
import { showDataSet, showDataSetToFolder, showDataInfoFile, showDataInfoFolder, searchData, showSettings } from '../controllers/showDataSet.js';
import { creatFolder } from '../controllers/folderController.js';
import { uploadFile } from '../controllers/fileController.js';
import { rename } from '../controllers/renameController.js';
import { deleteFile, deleteFolder } from '../controllers/deleteDataController.js';
import { downloadFile } from '../controllers/downloadController.js';
import { accessCheck, accessChange, deletePerson } from '../controllers/accessController.js';
import { deleteAccount, changeName, changeEmail, changePassword } from '../controllers/accountConroller.js';

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

router.post('/accessCheck', authenticate, accessCheck)

router.post('/accessChange', authenticate, accessChange, showDataSet)

router.post('/deletePerson', authenticate, deletePerson)

router.get('/downloadFile/:fileId', authenticate, downloadFile)

// ===============================SETTINGS==================================

router.post('/showSettings', authenticate, showSettings)

router.post('/changeName', authenticate, changeName)

router.post('/changeEmail', authenticate, changeEmail)

router.post('/changePassword', authenticate, changePassword)

router.post('/deleteAccount', authenticate, deleteAccount)

router.get('/logOutOfAccount', authenticate, logOutOfAccount)

export default router