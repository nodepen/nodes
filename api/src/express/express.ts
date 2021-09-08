import express from 'express'
import cors from 'cors'
import { createServer } from 'http'

export const app = express()
app.use(cors())

app.get('/', (_, res) => {
  res.set('Howdy!')
})

export const server = createServer(app)
