import { User } from '../models/User.js'
import { nanoid } from 'nanoid'
import { generateRefreshToken, generateToken, tokenVerificatiosErrors } from '../utils/tokenManager.js'
import { transporter } from '../utils/mailer.js'
import ejs from 'ejs'
import path from 'path'
import { __dirname } from '../utils/__dirname.js'

// Register User
//
export const register = async (req, res) => {
  const { email, username, password } = req.body

  // const user = await User.findOne({ username })
  const user = await User.findOne({
    $or: [
      { username },
      { email }
    ]
  })
  if (user) {
    return res.status(400).json({ error: 'El usuario o el correo ya existen' })
  }

  const newUser = new User({
    username,
    email,
    password,
    tokenConfirm: nanoid()
  })

  await transporter.sendMail({
    from: 'Somos el equipo de piola, CONFIRMA tu cuenta', // sender address
    to: newUser.email, // list of receivers
    subject: 'Confirma tu cuenta ✔', // Subject line
    text: 'Verifica tu cuenta con un solo click', // plain text body
    html: await ejs.renderFile(path.resolve(__dirname(import.meta.url), '../views/gmail.html'), { newUser })
  })

  // izlkhkljfhpyukvn
  try {
    await newUser.save()
    res.json(newUser)
  } catch (error) {
    return res.status(500).json({ error: 'Error de servidor' })
  }
}

// Login User
//
export const login = async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await User.findOne({ username })
    if (!user) throw new Error('El usuario o la contraseña son incorrectos')
    if (!user.confirmedAccount) throw new Error('Confirma tu cuenta para iniciar')

    const responsePassword = await user.comparePassword(password, user.password)
    if (!responsePassword) throw new Error('El usuario o la contraseña son incorrectos')

    const { token, expiresIn } = generateToken(user._id)
    generateRefreshToken(user._id, res)

    res.send({
      username: user.username,
      id: user._id,
      token,
      expiresIn
    })
  } catch (error) {
    return res.status(403).json({ error: error.message })
  }
}

export const refreshToken = async (req, res) => {
  try {
    const { token } = generateToken(req.userId)
    const user = await User.findById(req.userId)
    res.send({
      username: user.username,
      id: user.id,
      token
    })
  } catch (error) {
    console.log(error.message)
    return res
      .status(401)
      .send({ error: tokenVerificatiosErrors[error.message] })
  }
}

export const logout = (req, res) => {
  res.clearCookie('refreshToken')
  res.json({ message: 'sesión cerrada' })
}
