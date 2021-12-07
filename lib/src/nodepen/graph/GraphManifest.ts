import { SolutionManifest } from '../solution'
import { GraphElementsMap } from './GraphElementsMap'

export type GraphManifest = {
  id: string
  name: string
  author: {
    id: string
    name: string
  }
  graph: {
    elements: GraphElementsMap
    solution: SolutionManifest
  }
  files: {
    graphBinaries?: string
    graphJson?: string
    graphSolutionJson?: string
    thumbnailImage?: string
    thumbnailVideo?: string
  }
}