import { Grasshopper, Glasshopper } from 'glib'
import { Socket } from 'socket.io-client'

type LibraryCategory =
  | 'params'
  | 'maths'
  | 'sets'
  | 'vector'
  | 'curve'
  | 'transform'

export type GraphStore = {
  elements: { [key: string]: Glasshopper.Element.Base }
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
  preflight: {
    getLibrary: boolean
    getSession: boolean
  }
}