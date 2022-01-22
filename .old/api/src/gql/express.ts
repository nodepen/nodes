import express from 'express'
import cors from 'cors'
import { createServer } from 'http'

// Create basic express app and public routes
export const app = express()
app.use(cors())

app.get('/', (_, res) => {
  res.send('Howdy!')
})

app.get('/health', (_, res) => {
  res.send('Feeling swell!')
})

// Wrap and export as core server object
export const server = createServer(app)
