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
    deleteGraph: {
      graphId: string
    }
    renameGraph: {
      graphId: string
      name: string
    }
    scheduleSaveGraph: {
      solutionId: string
      graphId: string
      graphJson: string
    }
  }
}
