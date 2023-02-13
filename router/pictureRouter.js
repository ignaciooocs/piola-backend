import express from 'express'
import multer from 'multer'
import path from 'path'
// import { fileURLToPath } from 'url'
import { deletePicture, postPicture } from '../controllers/pictureController.js'
import { requireToken } from '../middleware/requireToken.js'
import { __dirname } from '../utils/__dirname.js'

export const pictureRouter = express.Router()

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// Storage de multer
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const filePath = path.resolve(__dirname(import.meta.url), '../public/profile-picture')
    cb(null, filePath)
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname)
    cb(null, `${Date.now()}${fileExtension}`)
  }
})

// upload function
const uploadFiles = multer({
  storage: diskStorage,
  fileFilter: function (req, file, cb) {
    const acceptedExtensions = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG']
    const fileExtension = path.extname(file.originalname)
    const inAnAcceptedExtension = acceptedExtensions.includes(fileExtension)
    if (inAnAcceptedExtension) {
      cb(null, true)
    } else {
      cb(null, false)
    }
  }
})

pictureRouter.post('/', requireToken, uploadFiles.single('picture'), postPicture)

pictureRouter.delete('/:imageName', requireToken, deletePicture)
