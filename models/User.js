import mongoose from 'mongoose'
import bcript from 'bcrypt'

const { Schema, model } = mongoose

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: { unique: true }
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: { unique: true }
  },
  biography: {
    type: String,
    default: null
  },
  password: {
    type: String,
    required: true
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'Like'
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }
  ],
  liked: [{
    type: Schema.Types.ObjectId,
    ref: 'Like'
  }],
  picture: {
    type: String,
    default: null
  },
  notifications: [{
    type: Schema.Types.ObjectId,
    ref: 'Notification'
  }],
  tokenConfirm: {
    type: String,
    default: null
  },
  confirmedAccount: {
    type: Boolean,
    default: false
  },
  stories: [{
    type: Schema.Types.ObjectId,
    ref: 'Storie'
  }]
},
{
  versionKey: false
})

UserSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.password
  }
})

UserSchema.pre('save', async function (next) {
  const user = this
  if (!user.isModified('password')) return next()
  try {
    const salt = await bcript.genSalt(10)
    user.password = await bcript.hash(user.password, salt)
    next()
  } catch (error) {
    console.log('ocurrio un error')
    throw new Error('fallo el hash de la contraseña')
  }
})

UserSchema.methods.comparePassword = async function (frontPassword) {
  return await bcript.compare(frontPassword, this.password)
}

export const User = model('User', UserSchema)
