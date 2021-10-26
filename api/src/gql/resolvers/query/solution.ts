export const solution = (
  _parent: any,
  args: any,
  context: any,
  _info: any
): any => {
  console.log({ _parent })
  console.log({ args })
  console.log({ context })

  return fetchSolution({ graphId: 'smt', solutionId: 'sid' })
}

type Parent = {
  graphId: string
  solutionId: string
}

const fetchSolution = (p: Parent) => {
  return {
    value: (parent: any, args: any, context: any, info: any) => {
      console.log({ parent })
      console.log({ args })
      console.log({ context })
    },
  }
}
