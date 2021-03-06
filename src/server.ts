import express from 'express'
import 'express-async-errors'
import path from 'path'
import cors from 'cors'
import 'dotenv/config'
import './database/connection'
import errorHandler from './errors/handler'
import route from './routes'

const port = process.env.PORT || 3333

const app = express()

app.use(cors())
app.use(express.json())
app.use(route)
app.use(String(process.env.STORAGE_URL), express.static(path.join(__dirname, '..', 'tmp', 'uploads')))
app.use(errorHandler);

app.listen(port, () => console.log(`Server ON and running @ http://localhost:${port}`))