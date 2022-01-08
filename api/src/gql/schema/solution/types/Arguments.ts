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
      observerId: string
      graphJson: string
      graphId: string
      solutionId: string
    }
    updateSelection: {
      observerId: string
      graphId: string
      selection: string[]
    }
    updateVisibility: {
      observerId: string
      graphId: string
      ids: string[]
    }
  }
  Solution: {
    value: {
      elementId: string
      parameterId: string
    }
  }
}
