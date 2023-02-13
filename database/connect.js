import mongoose from 'mongoose'

const DATABASE_URI = process.env.URI_DATABASE

mongoose.set('strictQuery', false)

mongoose.connect(DATABASE_URI)
  .then(() => {
    console.log('Database connected')
  }).catch(() => {
    console.log('Error con MongoDB')
  })
