import express from 'express'
import { requireToken } from '../middleware/requireToken.js'
import { Storie } from '../models/Storie.js'
import { User } from '../models/User.js'
export const storieRouter = express.Router()

storieRouter.post('/', requireToken, async (req, res) => {
  const { by, comment, response, color } = req.body
  const { userId } = req

  try {
    const user = await User.findById(userId)

    const newStorie = new Storie({
      by,
      comment,
      user: user._id,
      response,
      color
    })

    await newStorie.save()
    user.stories = user.stories.concat(newStorie._id)
    await user.save()

    setTimeout(async () => {
      // Eliminamos la storie del usuario
      await Storie.findByIdAndRemove(newStorie._id)
      await User.updateOne({ stories: newStorie._id }, { $pull: { stories: newStorie._id } })
    }, 1000 * 60 * 10)
    res.json(newStorie)
  } catch (error) {
    console.log(error.message)
  }
})

storieRouter.delete('/:id', requireToken, async (req, res) => {
  const { id } = req.params

  try {
    const storie = await Storie.findById(id)

    const user = await User.findById(storie.user)

    user.stories = user.stories.filter((commentId) => commentId.toString() !== id)

    await Storie.findByIdAndDelete(id)
    await user.save()
    res.status(204).end()
  } catch (error) {
    console.log('no se eliminó la historia')
  }
}
)
