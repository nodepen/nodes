import { Grasshopper } from 'glib'
import { Socket } from 'socket.io-client'

type LibraryCategory =
  | 'params'
  | 'maths'
  | 'sets'
  | 'vector'
  | 'curve'
  | 'transform'

export type GraphStore = {
  library: {
    [key in LibraryCategory]: {
      [key: string]: Grasshopper.Component[]
    }
  }
  socket: {
    io: Socket
    id: string
  }
  ready: boolean
}