import React from 'react'

type StatisticsProps = {
  values: number[]
  title: string
  floor?: number
}

export const Statistics = ({ values, title, floor = 0 }: StatisticsProps): React.ReactElement => {
  const adjustedValues = values.map((v) => v - floor)

  const actualAverage = adjustedValues.map((t) => t - floor).reduce((t, x) => t + x, 0) / adjustedValues.length
  const avg = Math.round(actualAverage)
  const max = Math.max(...adjustedValues)
  const now = adjustedValues[0]

  return (
    <div className="p-2" style={{ width: 500 }}>
      {adjustedValues.map((val, i) => (
        <div
          key={`${val}-${i}`}
          className="inline-block w-8 h-8 bg-dark mr-2"
          style={{ background: val === 0 ? '#F7F7F7' : `rgba(0, 0, 0, ${val / max})` }}
        />
      ))}
      <div className="inline-block w-full pr-2 h-8">
        <div className="w-full h-full flex flex-row items-center">
          <p className="font-panel text-xl text-dark font-black flex-grow">{title.toUpperCase()}</p>
          {floor > 0 ? <p className="font-panel text-xl text-dark font-black mr-2">({floor})</p> : null}
          <p className="font-panel text-xl text-dark font-black mr-2">+{max}</p>
          <p className="font-panel text-xl text-dark font-black mr-2">/{avg}</p>
          <p className="font-panel text-xl text-dark font-black mr-2">&gt;{now}</p>
        </div>
      </div>
    </div>
  )
}
