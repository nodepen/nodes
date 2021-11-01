export type Arguments = {
  Query: {
    solution: {
      graphId: string
      solutionId: string
    }
  }
  Mutation: {
    scheduleSolution: {
      graphJson: string
      graphId: string
      solutionId: string
    }
  }
  Solution: {
    value: {
      elementId: string
      parameterId: string
    }
    files: never
  }
  SolutionFiles: {
    gh: never
    json: never
  }
}
