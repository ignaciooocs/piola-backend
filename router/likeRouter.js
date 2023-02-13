import express from 'express'
import { getLikes, likeUser, removeLike, removeLikeById } from '../controllers/likeController.js'
import { requireToken } from '../middleware/requireToken.js'
export const likeRouter = express.Router()

likeRouter.get('/', getLikes)

likeRouter.post('/:id', requireToken, likeUser)

likeRouter.delete('/:id', requireToken, removeLike)

likeRouter.delete('/by/:id', removeLikeById)
