import Jwt from 'jsonwebtoken'

export const generateToken = (id) => {
  const expiresIn = 60 * 15

  try {
    const token = Jwt.sign({ id }, process.env.SECRET, { expiresIn })
    return { token, expiresIn }
  } catch (error) {
    console.log(error)
  }
}

export const generateRefreshToken = (id, res) => {
  const expiresIn = 60 * 60 * 24 * 30
  try {
    const refreshToken = Jwt.sign({ id }, process.env.REFRESH_SECRET, { expiresIn })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: !(process.env.MODO === 'developer'),
      expires: new Date(Date.now() + expiresIn * 1000),
      sameSite: 'lax'
    })
  } catch (error) {
    console.log(error)
  }
}

export const tokenVerificatiosErrors = {
  'invalid signature': 'La firma del JWT no es valida',
  'jwt expired': 'JWT exoirado',
  'invalid token': 'Token no es valido',
  'jwt malformed': 'JWT formato no valido'
}
