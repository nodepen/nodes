import React from 'react'
import { ComponentCount } from '../types'

type ComponentCountProps = {
  count: ComponentCount
}

export const QueueComponentCount = ({ count }: ComponentCountProps): React.ReactElement => {
  const toOrderedTallies = (byUser: ComponentCount): [string, number][] => {
    const byComponent: { [id: string]: number } = {}

    Object.keys(byUser).forEach((userId) => {
      const counts = byUser[userId]

      Object.entries(counts).forEach(([componentId, count]) => {
        if (componentId in byComponent) {
          byComponent[componentId] = byComponent[componentId] + count
          return
        }

        byComponent[componentId] = count
      })
    })

    const tuple = Object.entries(byComponent)
    tuple.sort((a, b) => b[1] - a[1])

    return tuple
  }

  const data = toOrderedTallies(count)

  return (
    <>
      {data.map(([component, count]) => {
        return (
          <div key={`count-${component}`} className="w-full h-6 mb-2 flex flex-row justify-evenly items-center">
            <p>{component}</p>
            <p>{count}</p>
          </div>
        )
      })}
    </>
  )
}
