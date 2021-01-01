import { Grasshopper } from 'glib'

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
  ready: boolean
}