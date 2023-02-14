import express from 'express'
import { deleteUser, getUser, getUserByUsername, getUsers, searchUsers, updateUser } from '../controllers/userController.js'
import { requireToken } from '../middleware/requireToken.js'
export const userRouter = express.Router()

userRouter.get('/search/:username', searchUsers)

userRouter.get('/', getUsers)

userRouter.get('/:id', getUser)

userRouter.get('/user/:username', getUserByUsername)

userRouter.put('/:id', requireToken, updateUser)

userRouter.delete('/', requireToken, deleteUser)