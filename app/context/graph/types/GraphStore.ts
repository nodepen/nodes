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
  camera: {
    position: [number, number]
    ref: React.MutableRefObject<HTMLDivElement>
  }
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