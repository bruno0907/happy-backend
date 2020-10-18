import express from 'express'
import 'express-async-errors'
import path from 'path'
import cors from 'cors'
import 'dotenv/config'
import './database/connection'
import errorHandler from './errors/handler'
import route from './routes'

const app = express()

app.use(cors())
app.use(express.json())
app.use(route)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))
app.use(errorHandler);

app.listen(process.env.PORT || 3333, () => console.log(`Server running on http://localhost:${process.env.PORT} address`))