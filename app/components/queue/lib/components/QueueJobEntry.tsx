import React, { useEffect, useState } from 'react'
import { Glasshopper } from 'glib'
import { useQuery, useApolloClient } from '@apollo/client'
import { SOLUTION_STATUS, GRAPH_JSON } from '@/queries'

type QueueJobEntryProps = {
  sessionId: string
  solutionId: string
  registerGraph: (user: string, graph: Glasshopper.Element.Base[]) => void
}

export const QueueJobEntry = ({ sessionId, solutionId, registerGraph }: QueueJobEntryProps): React.ReactElement => {
  const client = useApolloClient()
  const { data, stopPolling } = useQuery(SOLUTION_STATUS, { variables: { sessionId, solutionId }, pollInterval: 500 })

  const status = data?.getSolutionStatus?.status?.toLowerCase() ?? 'waiting'
  const userColor = stringToColour(sessionId)

  const [duration, setDuration] = useState<string>()
  const [graph, setGraph] = useState<Glasshopper.Element.Base[]>()

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'succeeded': {
        return '#98E2C6'
      }
      case 'failed': {
        return '#FF6868'
      }
      default: {
        return '#C4C4C4'
      }
    }
  }

  const statusColor = getStatusColor(status)

  useEffect(() => {
    if (status === 'succeeded' || status === 'failed') {
      stopPolling()
      setDuration(data.getSolutionStatus.duration)

      client.query({ query: GRAPH_JSON, variables: { sessionId, solutionId } }).then(({ data }) => {
        const json = data.getGraphJson

        const graph: Glasshopper.Element.Base[] = Object.values(JSON.parse(json))
        setGraph(graph)
        registerGraph(sessionId, graph)
      })
    }
  }, [status])

  return (
    <div className={`${status === 'failed' ? 'bg-red-200' : ''} w-full h-10 p-2 mb-2 rounded-md flex items-center`}>
      <div className="w-6 h-6 mr-2 rounded-full" style={{ background: statusColor }} />
      <div className="w-6 h-6 mr-2 rounded-full" style={{ background: userColor }} />
      {status === 'failed' ? (
        <div className="flex-grow flex flex-col items-end">
          <p className="text-xs">{sessionId}</p>
          <p className="text-xs">{solutionId}</p>
        </div>
      ) : (
        <>
          <p>{sessionId.split('-')[1]}</p>
          <p> : </p>
          <p>{solutionId.split('-')[1]}</p>
          <div className="flex-grow flex justify-end items-center">
            {graph ? <p>({graph.length})</p> : null}
            {duration ? <p className="ml-2">{duration}ms</p> : null}
          </div>
        </>
      )}
    </div>
  )
}

const stringToColour = (str: string): string => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  let colour = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    colour += ('00' + value.toString(16)).substr(-2)
  }
  return colour
}
