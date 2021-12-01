import { GrasshopperGraphManifest } from './GrasshopperGraphManifest'

export type Arguments = {
  Mutation: {
    scheduleSaveGraph: {
      graphId: string
      graphJson: string
    }
  }
}
