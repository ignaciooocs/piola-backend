import express from 'express'
import { deletePicture, postPicture } from '../controllers/pictureController.js'
import { requireToken } from '../middleware/requireToken.js'

export const pictureRouter = express.Router()

pictureRouter.post('/', requireToken, postPicture)

pictureRouter.delete('/', requireToken, deletePicture)
