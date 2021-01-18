import { SolutionMessage } from './SolutionMessage'

export type SolutionReady = {
  solutionId: string
  runtimeMessages: SolutionMessage[]
}
