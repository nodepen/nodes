import React from 'react'
import { useQuery } from '@apollo/client'
import { QUEUE_STATUS } from '@/queries'
import { QueueJobEntry } from './QueueJobEntry'

export const QueueContainer = (): React.ReactElement => {
  const { data } = useQuery(QUEUE_STATUS, { variables: { depth: 20 }, pollInterval: 500 })

  const jobs = data?.getQueueStatus?.jobs ?? []

  return (
    <main className="w-full h-full p-4 flex flex-col">
      <div className="w-full h-76 mb-4 bg-green" />
      <div className="w-full flex-grow flex flex-row items-stretch">
        <div className="w-1/2 mr-2 bg-blue-200 flex flex-col"></div>
        <div className="w-1/2 ml-2 flex flex-col">
          {jobs.map((job) => {
            const [sessionId, solutionId] = job.split(';')
            return (
              <QueueJobEntry key={`job-${sessionId}-${solutionId}`} sessionId={sessionId} solutionId={solutionId} />
            )
          })}
        </div>
      </div>
      {/* <h1>{data?.getQueueStatus?.active_count}</h1>
      {data?.getQueueStatus?.jobs.map((entry, i) => (
        <p key={i}>{entry}</p>
      ))} */}
    </main>
  )
}
