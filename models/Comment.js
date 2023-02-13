import mongoose from 'mongoose'
const { Schema, model } = mongoose

const commentSchema = new Schema({
  by: {
    type: String
  },
  comment: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
},
{
  versionKey: false,
  timestamps: true
})

export const Comment = model('Comment', commentSchema)
