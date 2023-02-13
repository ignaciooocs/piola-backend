import mongoose from 'mongoose'

const { Schema, model } = mongoose

const LikeSchema = new Schema({
  fromUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

export const Like = model('Like', LikeSchema)
