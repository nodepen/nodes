import { Socket } from 'socket.io-client'

export type SessionStore = {
  io: Socket
  id: string
}
