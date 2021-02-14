import React, { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { SOLUTION_STATUS } from '@/queries'

type QueueJobEntryProps = {
  sessionId: string
  solutionId: string
}

export const QueueJobEntry = ({ sessionId, solutionId }: QueueJobEntryProps): React.ReactElement => {
  const { data, stopPolling } = useQuery(SOLUTION_STATUS, { variables: { sessionId, solutionId }, pollInterval: 500 })

  const status = data?.getSolutionStatus?.status?.toLowerCase() ?? 'waiting'
  const userColor = stringToColour(sessionId)

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
    }
  }, [status])

  return (
    <div className={`${status === 'failed' ? 'bg-red-200' : ''} w-full h-10 p-2 mb-2 rounded-md flex items-center`}>
      <div className="w-6 h-6 mr-2 rounded-full" style={{ background: statusColor }} />
      <div className="w-6 h-6 mr-2 rounded-full" style={{ background: userColor }} />
      <p>{sessionId.split('-')[1]}</p>
      <p> : </p>
      <p>{solutionId.split('-')[1]}</p>
      <p>{status}</p>
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
