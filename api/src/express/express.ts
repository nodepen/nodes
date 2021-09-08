import express from 'express'
import cors from 'cors'
import { createServer } from 'http'

export const app = express()
app.use(cors())

app.get('/', (_, res) => {
  res.send('Howdy!')
})

app.get('/health', (_, res) => {
  res.send('Feeling swell!')
})

export const server = createServer(app)
