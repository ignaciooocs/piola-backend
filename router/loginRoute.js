import express from 'express'
import { body } from 'express-validator'
import { register, login, refreshToken, logout } from '../controllers/loginController.js'
import { validationResults } from '../middleware/validationResults.js'
import { requireRefreshToken } from '../middleware/requireRefreshToken.js'

export const loginRouter = express.Router()

loginRouter.post('/register', [
  body('email', 'El correo electrónico es requerido').notEmpty(),
  body('email', 'El formato del correo electrónico no es válido').isEmail(),
  body('email', 'El correo electrónico debe tener al menos 6 caracteres').isLength({ min: 10 }),
  body('email', 'El correo electrónico no puede tener más de 255 caracteres').isLength({ max: 255 }),
  body('username', 'el nombre de usuario de contener minimo 3 caracteres')
    .trim()
    .isLength({ min: 3 }),
  body('username', 'el nombre de usuario debe contener maximo 15 caracteres')
    .isLength({ max: 15 }),
  body('password', 'La contraseña debe contener minimo 6 caracteres')
    .trim()
    .isLength({ min: 6 })
], validationResults, register)

loginRouter.post('/login', login)

loginRouter.get('/refresh', requireRefreshToken, refreshToken)

loginRouter.get('/logout', logout)

// loginRouter.get('confirm/account:token', confirmRouter)
