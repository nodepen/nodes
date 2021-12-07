import { GrasshopperGraphManifest } from './GrasshopperGraphManifest'

export type Arguments = {
  Query: {
    graph: {
      graphId: string
    }
    graphsByAuthor: {
      author: string
    }
  }
  Mutation: {
    scheduleSaveGraph: {
      solutionId: string
      graphId: string
      graphJson: string
    }
  }
}
