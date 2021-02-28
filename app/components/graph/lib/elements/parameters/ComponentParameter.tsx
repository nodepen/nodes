import React, { useRef, useEffect } from 'react'
import { Glasshopper } from 'glib'
import { useGraphManager } from '@/context/graph'
import { useLongHover, useLongPress } from '@/hooks'
import { Tooltip } from '../../annotation'

type ComponentParameterProps = {
  source: {
    element: string
    parameter: string
  }
  mode: 'input' | 'output'
}

export const ComponentParameter = ({ source, mode }: ComponentParameterProps): React.ReactElement => {
  const {
    store: { elements, overlay },
    dispatch,
  } = useGraphManager()

  const element = elements[source.element] as Glasshopper.Element.StaticComponent

  const parameterIndex = element.current[mode === 'input' ? 'inputs' : 'outputs'][source.parameter]
  // const parameterCount = Object.keys(element.current[mode === 'input' ? 'inputs' : 'outputs']).length
  const parameter = element.template[mode === 'input' ? 'inputs' : 'outputs'][parameterIndex]

  const values = element.current.values[source.parameter]

  const { nickname } = parameter

  const handlePointerEnter = (): void => {
    dispatch({ type: 'graph/wire/capture-live-wire', targetElement: source.element, targetParameter: source.parameter })
  }

  const handlePointerLeave = (): void => {
    dispatch({ type: 'graph/wire/release-live-wire', targetElement: source.element, targetParameter: source.parameter })
  }

  const handleLongHover = (e: PointerEvent): void => {
    const { pageX, pageY } = e

    const tooltip = (
      <Tooltip parameter={parameter} data={values} onDestroy={() => dispatch({ type: 'tooltip/clear-tooltip' })} />
    )

    dispatch({ type: 'tooltip/set-tooltip', content: tooltip, position: [pageX, pageY] })
  }

  const parameterRef = useLongHover(handleLongHover)

  const handleLongPress = (e: PointerEvent): void => {
    e.stopPropagation()

    const [cx, cy] = element.current.anchors[source.parameter]

    const { pageX: tx, pageY: ty } = e

    dispatch({ type: 'graph/wire/start-live-wire', from: [cx, cy], to: [tx, ty], owner: source })

    parameterRef.current.releasePointerCapture(e.pointerId)
  }

  useLongPress(handleLongPress, parameterRef)

  return (
    <div
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={(e) => e.stopPropagation()}
      ref={parameterRef}
      className="flex-grow box-border pt-1 pb-1"
    >
      <div
        className={`${
          mode === 'input' ? 'pr-4 mr-1 ml-2' : 'pl-4 ml-1 mr-2'
        } h-full flex flex-row items-center rounded-sm hover:bg-pale`}
      >
        <div
          className={`${mode === 'input' ? 'ml-1' : 'mr-1'} mt-1 mb-1 font-panel font-semibold text-base select-none`}
        >
          {nickname}
        </div>
      </div>
    </div>
  )
}
