import 'dotenv/config'
import './database/connect.js'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { loginRouter } from './router/loginRoute.js'
import { commentRouter } from './router/commentRouter.js'
import { userRouter } from './router/userRouter.js'
import { likeRouter } from './router/likeRouter.js'
import { pictureRouter } from './router/pictureRouter.js'
import { confirmRouter } from './router/confirmRouter.js'
import { storieRouter } from './router/storieRouter.js'

const app = express()

const whiteList = [process.env.ORIGIN1, process.env.ORIGIN2]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whiteList.includes(origin)) {
      return callback(null, origin)
    }
    return callback(new Error('Error de CORS origin: ' + origin + ' No autorizado'))
  },
  credentials: true
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.use('/api/v1/users', userRouter)
app.use('/api/v1/profile/image', pictureRouter)
app.use('/api/v1/auth', loginRouter)
app.use('/api/v1/comment', commentRouter)
app.use('/api/v1/like', likeRouter)
app.use('/api/v1/storie', storieRouter)
app.use('/api/v1/confirm/account', confirmRouter)

const PORT = process.env.PORT

app.listen(PORT, () => console.log('server running'))
