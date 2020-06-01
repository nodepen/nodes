import * as http from 'http'
import express, { Request, Response } from 'express'
import socketIO, { Socket } from 'socket.io'

const PORT = process.env.PORT || 3000

const app = express()
app.set('port', PORT)
const server = new http.Server(app)
const io = socketIO(server)

app.get('/', (req: Request, res: Response) => {
  res.send('howdy')
})

io.on('connection', (socket: Socket) => {
  console.log('Connection made!')
  socket.emit('howdy', { message: 'Well howdy!' })
})

server.listen(PORT, () => {
  console.log(`Server started. Listening on port ${3000}`)
})
