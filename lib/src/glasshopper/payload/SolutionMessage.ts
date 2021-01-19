type SolutionMessageLevel = 'error' | 'warning' | 'info'

export type SolutionMessage = {
  element: string
  message: string
  level: SolutionMessageLevel
}
