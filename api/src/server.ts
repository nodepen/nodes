import * as http from 'http'
import express, { Request, Response } from 'express'
import socketIO, { Socket } from 'socket.io'

import { UserRoutes } from './routes'

const PORT = process.env.PORT || 3100

const app = express()
app.set('port', PORT)
const server = new http.Server(app)
const io = socketIO(server)

app.get('/', (req: Request, res: Response) => {
  res.send('howdy')
})

app.use('/api', UserRoutes)

io.on('connection', (socket: Socket) => {
  console.log('Connection made!')
  socket.emit('howdy', { message: 'Well howdy!' })
})

server.listen(PORT, () => {
  console.log(`Server started. Listening on port ${PORT}`)
})
