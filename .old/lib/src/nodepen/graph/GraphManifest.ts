import { SolutionManifest } from '../solution'
import { GraphElementsMap } from './GraphElementsMap'
import { FileReference } from '../../gcp/Storage'

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
    graphBinaries?: FileReference
    graphJson?: FileReference
    graphSolutionJson?: FileReference
    thumbnailImage?: FileReference
    thumbnailVideo?: FileReference
    twitterThumbnailImage?: FileReference
  }
  stats: {
    views: number
  }
}