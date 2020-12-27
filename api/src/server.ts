import * as http from 'http'
import express, { Request, Response } from 'express'
import * as db from './db'
import * as io from './io'

import { UserRoutes } from './routes'

const PORT = process.env.PORT || 3100

const router = express().set('port', PORT)
const server = new http.Server(router)

db.initialize()
io.initialize(server)

// api.get('/', (req: Request, res: Response) => {
//   res.send('howdy')
// })

// api.use('/api', UserRoutes)

// io.on('connection', (socket: Socket) => {
//   console.log('Connection made!')
//   socket.emit('howdy', { message: 'Well howdy!' })
// })

server.listen(PORT, () => {
  console.log(`Server started. Listening on port ${PORT}`)
})
