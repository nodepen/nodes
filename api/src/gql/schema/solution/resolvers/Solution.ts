import { NodePen } from 'glib'
import { db } from '../../../../redis'
import { BaseResolverMap } from '../../base/types'
import { Arguments } from '../types'

type ParentObject = {
  graphId: string
  solutionId: string
}

export const Solution: BaseResolverMap<ParentObject, Arguments['Solution']> = {
  value: async ({ graphId, solutionId }, { elementId, parameterId }) => {
    const result = await db.get(
      `graph:${graphId}:solution:${solutionId}:${elementId}:${parameterId}`
    )

    const tree: NodePen.DataTreeBranch[] = JSON.parse(result)

    // Parse stringified db entries as proper objects
    // for (const branch of tree) {
    //   console.log(branch)

    //   for (const entry of branch.data) {
    //     const valueString = entry.value as string

    //     switch (entry.type) {
    //       case 'text': {
    //         entry.value =
    //       }
    //     }
    //   }
    // }

    // console.log(tree)

    return tree
  },
  files: ({ graphId, solutionId }) => {
    return { graphId, solutionId }
  },
}
