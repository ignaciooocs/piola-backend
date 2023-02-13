import { Like } from '../models/Like.js'
import { Notification } from '../models/Notification.js'
import { User } from '../models/User.js'

export const getLikes = async (req, res) => {
  const likes = await Like.find({})
  res.json(likes)
}

export const likeUser = async (req, res) => {
  try {
    const { userId } = req
    // Buscamos al usuario que recibe el like
    const toUser = await User.findById(req.params.id)
    const fromUser = await User.findById(userId)

    if (!toUser || !fromUser) {
      return res.status(404).send('Usuario no encontrado')
    }

    // Creamos un nuevo like
    const like = new Like({
      fromUser: userId,
      toUser: toUser._id
    })
    await like.save()

    // Añadimos el like al usuario
    toUser.likes = toUser.likes.concat(like._id)
    fromUser.liked = fromUser.liked.concat(like._id)
    await toUser.save()
    await fromUser.save()

    // Crear una nueva notificación
    const notification = new Notification({
      fromUser: userId,
      toUser: toUser._id,
      type: 'like'
    })
    await notification.save()

    // Añadir la notificación al usuario
    toUser.notifications = toUser.notifications.concat(notification._id)
    await toUser.save()

    return res.status(200).send('Usuario liked!')
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

export const removeLike = async (req, res) => {
  try {
    const { userId } = req
    // Buscamos al usuario que recibió el like
    const toUser = await User.findById(req.params.id)
    const fromUser = await User.findById(userId)

    if (!toUser) {
      return res.status(404).send('Usuario no encontrado')
    }

    // Buscamos el like específico que queremos eliminar
    const like = await Like.findOne({
      fromUser: userId,
      toUser: toUser._id
    })

    if (!like) {
      return res.status(404).send('Like no encontrado')
    }

    // Eliminamos el like de la base de datos
    await like.delete()

    // Eliminamos el like del usuario
    toUser.likes = toUser.likes.filter(likeId => {
      return likeId.toString() !== like._id.toString()
    })
    fromUser.liked = fromUser.liked.filter(likeId => {
      return likeId.toString() !== like._id.toString()
    })
    await toUser.save()
    await fromUser.save()

    // Buscamos la notificación correspondiente
    const notification = await Notification.findOne({
      toUser: toUser._id,
      fromUser: fromUser._id
    })

    // Eliminamos la notificación de la base de datos
    await notification.delete()

    // Eliminamos la notificación del usuario destinatario
    toUser.notifications = toUser.notifications.filter(notificationId => {
      return notificationId.toString() !== notification._id.toString()
    })
    await toUser.save()

    return res.status(200).send('Usuario unliked!')
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

export const removeLikeById = async (req, res) => {
  try {
    // Buscamos el like específico que queremos eliminar
    const like = await Like.findById(req.params.id)

    if (!like) {
      return res.status(404).send('Like no encontrado')
    }
    const toUser = await User.findById(like.toUser)
    const fromUser = await User.findById(like.fromUser)

    if (!toUser) {
      return res.status(404).send('Usuario no encontrado')
    }

    // Eliminamos el like de la base de datos
    await like.delete()

    // Eliminamos el like del usuario
    toUser.likes = toUser.likes.filter(likeId => {
      return likeId.toString() !== like._id.toString()
    })
    fromUser.liked = fromUser.liked.filter(likeId => {
      return likeId.toString() !== like._id.toString()
    })
    await toUser.save()
    await fromUser.save()

    // Buscamos la notificación correspondiente
    const notification = await Notification.findOne({
      toUser: toUser._id,
      fromUser: fromUser._id
    })

    // Eliminamos la notificación de la base de datos
    await notification.delete()

    // Eliminamos la notificación del usuario destinatario
    toUser.notifications = toUser.notifications.filter(notificationId => {
      return notificationId.toString() !== notification._id.toString()
    })
    await toUser.save()
    res.status(204).end()
  } catch (error) {
    res.json({ error: 'ocurrio un error eliminando los likes' })
  }
}
