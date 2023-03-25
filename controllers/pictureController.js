import { User } from '../models/User.js'

export const postPicture = async (req, res) => {
  const { url } = req.body
  const { userId } = req

  try {
    const user = await User.findById(userId)

    user.picture = url
    await user.save()

    res.json({ image: url })
  } catch (error) {
    console.log(error)
    return res.json({ error: 'ocurrio un error' })
  }
}

export const deletePicture = async (req, res) => {
  const { userId } = req

  try {
    const user = await User.findById(userId)
    user.picture = null
    await user.save()
    res.status(204).end()
  } catch (error) {
    if (error) {
      return res.status(404).json({ error: 'Error al eliminar la  imagen' })
    }
  }
}
