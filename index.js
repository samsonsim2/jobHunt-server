import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import 'express-async-errors'
dotenv.config()

//db
import connectDB from './db/connect.js'
//routers
import authRouter from './routes/authRoutes.js'
import jobsRouter from './routes/jobRoutes.js'
//import middleware
import notFoundMiddleware from './middlware/not-found.js'
import errorHandlerMiddleware from './middlware/error-handler.js'
import authenticateUser from './middlware/auth.js'
import helmet from 'helmet'
import xss from 'xss-clean'
import mongoSanitize from 'express-mongo-sanitize'

const app = express()
app.use(cors())
app.use(express.json())

app.use(helmet())
app.use(xss())
app.use(mongoSanitize())

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

//END POINTS
app.get('/', (req, res) => {
  res.send({ msg: 'welcome!' })
})
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter)
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
