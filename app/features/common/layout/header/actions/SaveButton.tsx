import { NodePen } from 'glib'
import { useGraphElements, useGraphId } from '@/features/graph/store/graph/hooks'
import { newGuid } from '@/features/graph/utils'
import { useMutation, gql } from '@apollo/client'
import React, { useMemo, useRef } from 'react'

const SaveButton = (): React.ReactElement => {
  const graphElements = useGraphElements()
  const graphId = useGraphId()

  // The elements that we want to save and load with a graph
  const persistedGraphElements = useMemo(() => {
    const persistedTypes: NodePen.ElementType[] = [
      'static-component',
      'static-parameter',
      'number-slider',
      'panel',
      'wire',
    ]
    return Object.values(graphElements).filter((element) => persistedTypes.includes(element.template.type))
  }, [graphElements])

  // The solution id associated with saving this graph revision
  const saveSolutionId = useRef(newGuid())

  const [scheduleSaveGraph] = useMutation(
    gql`
      mutation ScheduleSaveGraph($solutionId: String!, $graphId: String!, $graphJson: String!) {
        scheduleSaveGraph(solutionId: $solutionId, graphId: $graphId, graphJson: $graphJson)
      }
    `,
    {
      variables: {
        solutionId: saveSolutionId.current,
        graphId,
        graphJson: JSON.stringify(persistedGraphElements),
      },
    }
  )

  const handleSaveGraph = (): void => {
    scheduleSaveGraph().then((res) => {
      console.log({ saveResult: res })
      saveSolutionId.current = newGuid()
    })
  }

  return (
    <button
      className="h-6 mr-2 pl-1 pr-2 rounded-sm border-2 border-dark flex items-center leading-5 text-dark font-semibold text-xs"
      onClick={handleSaveGraph}
    >
      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z"></path>
      </svg>
      <p>Save</p>
    </button>
  )
}

export default React.memo(SaveButton)
