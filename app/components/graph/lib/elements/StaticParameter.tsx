import React, { useState, useEffect, useRef } from 'react'
import { Glasshopper } from 'glib'
import { useGraphManager } from '@/context/graph'
import { graph } from '@/utils'
import { ParameterIcon, ParameterIconShadow, ParameterSetValue } from './parameters'
import { Details, Grip, DataTree } from './common'

type StaticComponentProps = {
  instanceId: string
}

export const StaticParameter = ({ instanceId: id }: StaticComponentProps): React.ReactElement | null => {
  const {
    store: { elements, selected, solution },
    dispatch,
  } = useGraphManager()

  const parameterRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!parameterRef) {
      return
    }

    dispatch({ type: 'graph/register-element', ref: parameterRef, id })
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation()
    dispatch({ type: 'graph/selection-add', id })
  }

  const parameter = elements[id] as Glasshopper.Element.StaticParameter

  const { template, current } = parameter
  const [dx, dy] = current.position
  const isSelected = selected.includes(id)

  const [[overPanel, overDetails], setHovers] = useState<[boolean, boolean]>([false, false])
  const [detailsPinned, setDetailsPinned] = useState(false)

  const wireIsBlocking = elements['live-wire'] ? (elements['live-wire']?.current as any)?.mode !== 'hidden' : false

  const detailsVisible = !wireIsBlocking && (overPanel || overDetails)

  if (!elements[id] || elements[id].template.type !== 'static-parameter') {
    console.error(`Mismatch with element '${id}' and attempted type 'static-parameter'`)
    return null
  }

  const isLoading = !parameter.current.solution || parameter.current.solution !== solution.id

  return (
    <div className="absolute flex flex-row justify-center w-48" style={{ left: dx - 96, top: -dy }}>
      <div className="flex flex-col items-center">
        <button
          className="flex flex-row justify-center items-center relative z-20"
          ref={parameterRef}
          onPointerEnter={() => setHovers(([, details]) => [true, details])}
          onPointerLeave={() => setHovers(([, details]) => [false, details])}
          onClick={handleClick}
        >
          <div className="absolute z-0" style={{ left: '-12.5px', transform: 'translate(2px, 1.5px)' }}>
            <ParameterIconShadow />
          </div>
          <div
            className={`${
              isSelected ? 'bg-green' : 'bg-light'
            } h-8 pt-4 pb-4 flex flex-row items-center border-2 border-dark rounded-md shadow-osm relative z-20`}
          >
            <div className="absolute z-20" style={{ left: '-12.5px' }}>
              <ParameterIcon parent={parameter.id} />
            </div>
            <div className="ml-6 mr-6 font-panel text-base font-bold text-dark select-none z-10" style={{ left: '0' }}>
              {template.nickname.toLowerCase()}
              {isLoading ? '...' : null}
            </div>
          </div>
          <div className="absolute z-0 flex flex-col justify-center items-center" style={{ right: -8 }}>
            <Grip source={{ element: parameter.id, parameter: 'output' }} />
          </div>
        </button>
        {detailsPinned || detailsVisible ? (
          <div
            className="flex flex-col w-48 overflow-hidden z-10"
            style={{ transform: 'translate(0, -18px)' }}
            onPointerEnter={() => setHovers(([panel]) => [panel, true])}
            onPointerLeave={() => setHovers(([panel]) => [panel, false])}
          >
            <Details pinned={detailsPinned} onPin={() => setDetailsPinned((current) => !current)}>
              {(() => {
                if (Object.keys(current.values).length > 0) {
                  const valueCount = graph.getValueCount(current.values)
                  return (
                    <DataTree
                      label={`${valueCount} manual value${valueCount === 1 ? '' : 's'}`}
                      data={current.values}
                    />
                  )
                }

                const sourceCount = graph.getSourceCount(current.sources)
                if (sourceCount > 0) {
                  return (
                    <div className="mt-1 p-1 pl-2 pr-2 h-5 flex items-center rounded-sm bg-green">
                      <p
                        className="flex-grow font-panel font-bold text-darkgreen text-xs"
                        style={{ transform: 'translateY(1px)' }}
                      >{`${sourceCount} source${sourceCount === 1 ? '' : 's'}`}</p>
                      <p className="text-sm text-pale">&#9660;</p>
                    </div>
                  )
                }

                return <ParameterSetValue element={id} keepOpen={() => setDetailsPinned(true)} />
              })()}
            </Details>
          </div>
        ) : null}
      </div>
    </div>
  )
}
