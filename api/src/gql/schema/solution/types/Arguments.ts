export type Arguments = {
  Query: {
    restore: {
      userId: string
    }
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
    updateSelection: {
      observerId: string
      graphId: string
      selection: string[]
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
