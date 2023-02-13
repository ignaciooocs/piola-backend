import mongoose from 'mongoose'
const { Schema, model } = mongoose

const StorieSchema = new Schema({
  by: {
    type: String
  },
  comment: {
    type: String,
    require: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  color: {
    type: String
  },
  response: {
    type: String,
    require: true
  }
},
{
  versionKey: false
})

export const Storie = model('Storie', StorieSchema)
