import Jwt from 'jsonwebtoken'

export const requireToken = (req, res, next) => {
  try {
    let token
    const authorization = req.headers.authorization

    if (authorization) {
      token = authorization.split(' ')[1]
    }

    const decodedToken = Jwt.verify(token, process.env.SECRET)
    const { id: userId } = decodedToken
    req.userId = userId

    next()
  } catch (error) {
    console.log(error.message)
    const tokenVerificatiosErrors = {
      'invalid signature': 'La firma del JWT no es valida',
      'jwt expired': 'JWT exoirado',
      'invalid token': 'Token no es valido',
      'jwt malformed': 'JWT formato no valido'
    }
    return res
      .status(401)
      .send({ error: tokenVerificatiosErrors[error.message] })
  }
}
