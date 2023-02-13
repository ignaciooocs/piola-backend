import { Comment } from '../models/Comment.js'
import { User } from '../models/User.js'

export const getCommentById = async (req, res) => {
  const { id } = req.params
  try {
    const comment = await Comment.findById(id)
    if (!comment) {
      return res.json({ error: 'no se encontro el comentario' })
    }
    console.log(comment)
    res.json(comment)
  } catch (error) {
    console.log(error.message)
    console.log('error')
    return res.json({ error: error.message })
  }
}

export const postComment = async (req, res) => {
  const { id } = req.params
  const { comment, by } = req.body
  try {
    const user = await User.findById(id)

    const newComment = new Comment({
      comment,
      by,
      user: user._id
    })

    const commentSaved = await newComment.save()
    user.comments = user.comments.concat(commentSaved._id)
    await user.save()
    res.json(commentSaved)
  } catch (error) {
    console.log('No se guardo el comentario')
  }
}

export const deleteComment = async (req, res) => {
  const { id } = req.params
  try {
    const comment = await Comment.findById(id)

    const user = await User.findById(comment.user)

    user.comments = user.comments.filter((commentId) => commentId.toString() !== id)

    await Comment.findByIdAndDelete(id)
    await user.save()
    res.status(204).end()
  } catch (error) {
    console.log('no se eliminó el comentario')
  }
}
