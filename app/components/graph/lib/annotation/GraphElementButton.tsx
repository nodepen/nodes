import React, { useState, useMemo } from 'react'
import { Grasshopper } from 'glib'
import { useLongHover } from '@/hooks'
import { Tooltip } from './Tooltip'

type GraphElementButtonProps = {
  component: Grasshopper.Component
  onStartPlacement: (e: React.PointerEvent<HTMLButtonElement>, component: Grasshopper.Component) => void
}

export const GraphElementButton = ({ component, onStartPlacement }: GraphElementButtonProps): React.ReactElement => {
  const [tooltipPosition, setTooltipPosition] = useState<[number, number]>()

  const handleLongHover = (e: PointerEvent) => {
    const { pageX, pageY } = e

    setTooltipPosition([pageX, pageY])
  }

  const ref = useLongHover(handleLongHover)

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>): void => {
    onStartPlacement(e, component)
  }

  const tooltip = useMemo(() => <Tooltip component={component} onDestroy={() => setTooltipPosition(undefined)} />, [
    component,
  ])

  const [tx, ty] = tooltipPosition ?? [0, 0]

  return (
    <div className="w-8 h-8 mr-3" ref={ref}>
      <button
        className={`w-8 min-w-8 h-8 rounded-sm border-2 border-green hover:border-swampgreen flex justify-center items-center`}
        onPointerDown={handlePointerDown}
      >
        <img
          width="24px"
          height="24px"
          draggable="false"
          src={`data:image/png;base64,${component.icon}`}
          alt={component.name}
        />
      </button>
      {tooltipPosition ? (
        <div className="fixed" style={{ left: tx + 5, top: ty }}>
          {tooltip}
        </div>
      ) : null}
    </div>
  )
}
