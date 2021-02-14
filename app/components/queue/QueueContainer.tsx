import React from 'react'
import { useQuery } from '@apollo/client'
import { QUEUE_STATUS } from '@/queries'

export const QueueContainer = (): React.ReactElement => {
  const { data } = useQuery(QUEUE_STATUS, { variables: { depth: 20 }, pollInterval: 500 })

  return (
    <main className="w-full flex flex-col">
      <h1>{data?.getQueueStatus?.active_count}</h1>
      {data?.getQueueStatus?.jobs.map((entry, i) => (
        <p key={i}>{entry}</p>
      ))}
    </main>
  )
}
