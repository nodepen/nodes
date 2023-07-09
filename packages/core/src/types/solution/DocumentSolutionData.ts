import type { DocumentSolutionManifest } from './DocumentSolutionManifest'
import type { PortSolutionData } from './PortSolutionData'

export type DocumentSolutionData = {
  solutionId: string
  solutionManifest: DocumentSolutionManifest
  portSolutionData: PortSolutionData[]
}
