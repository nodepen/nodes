type SolutionMessageLevel = 'error' | 'warn' | 'info'

export type SolutionMessage = {
  element: string
  message: string
  level: SolutionMessageLevel
}
