import Jwt from 'jsonwebtoken'
import { tokenVerificatiosErrors } from '../utils/tokenManager.js'

export const requireRefreshToken = (req, res, next) => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken
    if (!refreshTokenCookie) throw new Error('No existe el refreshToken')

    const { id } = Jwt.verify(refreshTokenCookie, process.env.REFRESH_SECRET)

    req.userId = id
    next()
  } catch (error) {
    console.log(error.message)
    res.status(401).json({ error: tokenVerificatiosErrors[error.message] })
  }
}
