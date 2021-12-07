import { GrasshopperGraphManifest } from './GrasshopperGraphManifest'

export type Arguments = {
  Query: {
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