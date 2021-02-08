import { Grasshopper, Glasshopper } from 'glib'

type LibraryCategory = 'params' | 'maths' | 'sets' | 'vector' | 'curve' | 'transform'

export type GraphStore = {
  elements: { [key: string]: Glasshopper.Element.Base }
  camera: {
    position: [number, number]
    ref: React.MutableRefObject<HTMLDivElement>
  }
  solution: {
    id?: string
  }
  selected: string[]
  library: {
    [key in LibraryCategory]: {
      [key: string]: Grasshopper.Component[]
    }
  }
  ready: boolean
  preflight: {
    getLibrary: boolean
    getSession: boolean
  }
}
