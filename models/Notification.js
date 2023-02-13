import mongoose from 'mongoose'
const { Schema, model } = mongoose

const NotificationSchema = new Schema({
  fromUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true

  },
  toUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  type: {
    type: String,
    require: true
  },
  seen: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export const Notification = model('Notification', NotificationSchema)
