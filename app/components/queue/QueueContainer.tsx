import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { QUEUE_STATUS } from '@/queries'
import { QueueJobEntry, QueueComponentCount, Statistics } from './lib/components'
import { ComponentCount } from './lib/types'
import { Glasshopper } from 'glib'

export const QueueContainer = (): React.ReactElement => {
  const { data } = useQuery(QUEUE_STATUS, { variables: { depth: 50 }, pollInterval: 1500 })

  const jobs = data?.getQueueStatus?.jobs ?? []

  const [counts, setCounts] = useState<ComponentCount>({})

  const registerCounts = (userId: string, graph: Glasshopper.Element.Base[]): void => {
    const byUser: { [id: string]: number } = {}

    graph.forEach((element) => {
      switch (element.template.type) {
        case 'wire':
        case 'live-wire': {
          return
        }
        default: {
          const el = element as Glasshopper.Element.StaticComponent
          const id = el.template.guid
          if (id in byUser) {
            byUser[id] = byUser[id] + 1
            return
          }

          byUser[id] = 1
        }
      }
    })

    const updatedCounts = Object.assign(counts, { [userId]: byUser })

    setCounts(updatedCounts)
  }

  const [depths, setDepths] = useState<number[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setDepths((curr) => [data?.getQueueStatus?.active_count, ...curr].slice(0, 144))
    }, 1500)
    return () => clearInterval(interval)
  }, [data])

  const floor = new Set(depths).size == 1 ? depths?.[0] : 0

  return (
    <main className="w-full h-full p-6 flex flex-row items-stretch">
      <div className="flex flex-col" style={{ width: '30%' }}>
        {jobs.map((job) => {
          const [sessionId, solutionId] = job.split(';')
          return (
            <QueueJobEntry
              key={`job-${sessionId}-${solutionId}`}
              sessionId={sessionId}
              solutionId={solutionId}
              registerGraph={registerCounts}
            />
          )
        })}
      </div>
      <div className="flex-grow flex flex-col items-stretch">
        <div className="flex flex-row justify-end font-display font-black leading-none" style={{ fontSize: '256px' }}>
          {data?.getQueueStatus?.total_count}
        </div>
        <div className="flex flex-row justify-end font-display font-black leading-none" style={{ fontSize: '168px' }}>
          {data?.getQueueStatus?.session_count}
        </div>
        <div className="flex flex-row justify-end mt-6">
          <Statistics title="depth" values={depths} floor={floor} />
        </div>
      </div>
    </main>
  )

  return (
    <main className="w-full h-full p-4 flex flex-col">
      <div className="w-full h-76 mb-4 bg-green">
        {data?.getQueueStatus?.active_count}
        <br />
        {data?.getQueueStatus?.total_count}
        <br />
        {data?.getQueueStatus?.session_count}
      </div>
      <div className="w-full flex-grow flex flex-row items-stretch">
        <div className="w-1/2 mr-2 bg-blue-200 flex flex-col">
          <QueueComponentCount count={counts} />
        </div>
        <div className="w-1/2 ml-2 flex flex-col">
          {jobs.map((job) => {
            const [sessionId, solutionId] = job.split(';')
            return (
              <QueueJobEntry
                key={`job-${sessionId}-${solutionId}`}
                sessionId={sessionId}
                solutionId={solutionId}
                registerGraph={registerCounts}
              />
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
