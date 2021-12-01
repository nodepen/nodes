import { GrasshopperGraphManifest } from './GrasshopperGraphManifest'

export type Arguments = {
  Mutation: {
    scheduleSaveGraph: {
      solutionId: string
      graphId: string
      graphJson: string
    }
  }
}
