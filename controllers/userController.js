import bcript from 'bcrypt'
import { User } from '../models/User.js'
import { userPopulate } from '../utils/constanst.js'

// Metodo para crear el buscador de usuario
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

// Metodo para obtener un usuario por su Id
export const getUser = async (req, res) => {
  const { id } = req.params

  try {
    const user = await User.findById(id).populate(userPopulate)

    if (!user) throw new Error('No se encontró el usuario o ya se eliminó su cuenta')

    res.json(user)
  } catch (error) {
    return res.status(403).json({ error: error.message })
  }
}

// Metodo para obtener un usuario por su nombre de usuario
export const getUserByUsername = async (req, res) => {
  const { username } = req.params

  try {
    const user = await User.findOne({ username }).populate(userPopulate)

    if (!user) throw new Error('No se encontró el usuario o ya se eliminó su cuenta')

    res.json(user)
  } catch (error) {
    return res.status(403).json({ error: error.message })
  }
}

// Metodo para obtener todos los usuarios
export const getUsers = async (_, res) => {
  const users = await User.find({})
  res.json(users)
}

// Metodo para actualizar al usuario
export const updateUser = async (req, res) => {
  const { userId } = req
  const { username, password, prePassword, biography } = req.body
  try {
    // Se actualiza el mombre de usuario
    if (username) {
      const user = await User.findOne({ username })
      if (user) throw new Error('el usuario ya existe')
      const userUpdated = await User.findByIdAndUpdate(userId, { username }, { new: true })
      return res.json(userUpdated)
    }
    // Se actualiza la biografia
    if (biography) {
      const userUpdated = await User.findByIdAndUpdate(userId, { biography }, { new: true })
      return res.json(userUpdated)
    }

    // Se actualiza la contraseña
    if (password) {
      const user = await User.findById(req.userId)
      const responsePassword = await user.comparePassword(prePassword, user.password)
      if (!responsePassword) throw new Error('Contraseña incorrecta')

      const salt = await bcript.genSalt(10)
      const passwordHash = await bcript.hash(password, salt)
      const userUpdated = await User.findByIdAndUpdate(userId, { password: passwordHash }, { new: true })
      return res.json(userUpdated)
    }

    // Si no envia biografia se actualiza a null
    if (!biography) {
      const userUpdated = await User.findByIdAndUpdate(userId, { biography: '' }, { new: true })
      return res.json(userUpdated)
    }
  } catch (error) {
    return res.status(403).json({ error: error.message })
  }
}

// Metodo para eliminar al usuario
export const deleteUser = async (req, res) => {
  const { userId } = req
  try {
    await User.findByIdAndDelete(userId)
    res.status(204).end()
  } catch (error) {
    res.json({ error: 'No se elimino el usuario' })
  }
}

// Metodo para obtener todos los usuario a los cuales le a dado like un usuario en especifico
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

    likedUsers.sort(() => Math.random() - 0.5)
    res.json(likedUsers)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Hubo un error al buscar los usuarios.' })
  }
}

// Metodo para obtener las notificaciones de un usuario por su id
export const getNotifications = async (req, res) => {
  const { id } = req.params
  try {
    const user = await User.findById(id).populate(userPopulate)
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    const notifications = user.notifications.map(notification => ({
      toUser: notification.fromUser,
      createdAt: notification.createdAt
    }))

    const users = await Promise.all(
      notifications.map(async ({ toUser, createdAt }) => {
        const user = await User.findById(toUser)
        if (user) {
          return { ...user.toJSON(), notificationCreatedAt: createdAt }
        }
        return null
      })
    )

    res.json(users.filter(user => user !== null))
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Hubo un error al buscar los usuarios.' })
  }
}
