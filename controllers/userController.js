import bcript from 'bcrypt'
import { User } from '../models/User.js'
import { userPopulate } from '../utils/constanst.js'

export const searchUsers = async (req, res) => {
  const { username } = req.params
  const searchRegex = new RegExp(username, 'i')

  try {
    const users = await User.find({ username: { $regex: searchRegex } })
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getUser = async (req, res) => {
  const { id } = req.params

  const user = await User.findById(id).populate(userPopulate)

  if (!user) {
    res.json({ error: 'No se encontró el usuario o ya se eliminó su cuenta' })
    return
  }
  user.liked.sort(() => Math.random() - 0.5)
  res.json(user)
}

export const getUserByUsername = async (req, res) => {
  const { username } = req.params

  const user = await User.findOne({ username }).populate(userPopulate)

  if (!user) {
    res.json({ error: 'No se encontró el usuario o ya se eliminó su cuenta' })
    return
  }
  user.liked.sort(() => Math.random() - 0.5)
  res.json(user)
}

export const getUsers = async (req, res) => {
  const users = await User.find({})
  res.json(users)
}

export const updateUser = async (req, res) => {
  const { id } = req.params
  const { username, password, prePassword, biography } = req.body
  try {
    // Se actualiza el mombre de usuario
    if (username) {
      const user = await User.findOne({ username })
      if (user) throw new Error('el usuario ya existe')
      const userUpdated = await User.findByIdAndUpdate(id, { username }, { new: true })
      return res.json(userUpdated)
    }
    // Se actualiza la biografia
    if (biography) {
      const userUpdated = await User.findByIdAndUpdate(id, { biography }, { new: true })
      return res.json(userUpdated)
    }

    // Se actualiza la contraseña
    if (password) {
      const user = await User.findById(req.userId)
      const responsePassword = await user.comparePassword(prePassword, user.password)
      if (!responsePassword) throw new Error('Contraseña incorrecta')

      const salt = await bcript.genSalt(10)
      const passwordHash = await bcript.hash(password, salt)
      const userUpdated = await User.findByIdAndUpdate(id, { password: passwordHash }, { new: true })
      return res.json(userUpdated)
    }

    // Si no envia biografia se actualiza a null
    if (!biography) {
      const userUpdated = await User.findByIdAndUpdate(id, { biography: '' }, { new: true })
      return res.json(userUpdated)
    }
  } catch (error) {
    res.status(403).json({ error: error.message })
  }
}

export const deleteUser = async (req, res) => {
  const { userId } = req
  try {
    await User.findByIdAndDelete(userId)
    res.status(204).end()
  } catch (error) {
    res.json({ error: 'No se elimino el usuario' })
  }
}

export const getLikedUsers = async (req, res) => {
  const { id } = req.params

  try {
    const user = await User.findById(id).populate(userPopulate)
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' })
    }

    const likedToUserIds = user.liked.map((like) => like.toUser)

    // Esperar a que todas las promesas se resuelvan usando Promise.all()
    const likedUsers = await Promise.all(
      likedToUserIds.map(async (id) => {
        const liked = await User.findById(id).populate(userPopulate)
        return liked
      })
    )

    res.json(likedUsers)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Hubo un error al buscar los usuarios.' })
  }
}
