import express from 'express'
import { deleteComment, getCommentById, postComment } from '../controllers/commentController.js'
import { requireToken } from '../middleware/requireToken.js'

export const commentRouter = express.Router()

commentRouter.get('/:id', getCommentById)

commentRouter.post('/:id', requireToken, postComment)

commentRouter.delete('/:id', requireToken, deleteComment)
