import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { User } from '../models/User.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const postPicture = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Formato de archivo no valido' })
  }
  const { filename } = req.file
  const { userId } = req

  try {
    const user = await User.findById(userId)

    user.picture = filename
    user.save()

    res.json({ image: filename })
  } catch (error) {
    console.log(error)
    return res.json({ error: 'ocurrio un error' })
  }
}

export const deletePicture = async (req, res) => {
  const { userId } = req
  const { imageName } = req.params

  // if (imageName === 'not-picture2.png') return res.json({ message: 'No tienes foto' })

  const filePath = path.resolve(__dirname, `../public/profile-picture/${imageName}`)

  fs.unlink(filePath, async (err) => {
    if (err) {
      return res.status(404).json({ error: 'Error al eliminar la  imagen' })
    }
    const user = await User.findById(userId)

    user.picture = null
    user.save()

    res.json({ message: 'Imagen eliminada correctamente' })
  })
}
