import SocketIO from 'socket.io'
import * as Svgar from 'svgar-server'

export const rootSocket: (s: SocketIO.Socket) => void = (socket) => {
  console.log('Connection!')
  const cube = new Svgar.Cube()

  cube.initialize().then(() => {
    socket.emit('howdy', { message: 'svgar initialized' })
  })

  socket.on('poke', () => {
    console.log('poked!')
    socket.emit('howdy', { message: 'well howdy' })
    // socket.broadcast.emit('howdy', { message: 'well howdy' })
  })
}
