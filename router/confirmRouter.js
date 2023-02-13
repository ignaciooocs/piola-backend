import express from 'express'
import { User } from '../models/User.js'

export const confirmRouter = express.Router()

confirmRouter.get('/:token', async (req, res) => {
  const { token } = req.params

  try {
    if (!token) throw new Error('No existe el token')
    const user = await User.findOne({ tokenConfirm: token })

    if (!user) throw new Error('No existe el usuario')

    user.tokenConfirm = null
    user.confirmedAccount = true

    await user.save()

    res.json({ confirmed: true })
  } catch (error) {
    console.log(error.message)
    return res.json({ error: error.message })
  }
})
