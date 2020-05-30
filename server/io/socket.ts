import SocketIO from 'socket.io'

export const rootSocket: (s: SocketIO.Socket) => void = (socket) => {
  console.log('connection!')
  socket.on('poke', () => {
    console.log('poked!')
    socket.emit('howdy', { message: 'well howdy' })
    // socket.broadcast.emit('howdy', { message: 'well howdy' })
  })
}
