import React, { useRef, useEffect, useState, useMemo } from 'react'
import { Glasshopper } from 'glib'
import { Grip, Loading } from './common'
import { Tooltip } from '../annotation'
import { ComponentParameter } from './parameters'
import { useGraphManager } from '@/context/graph'
import { useElementStatus } from './utils'
import { useLongHover } from '@/hooks'

type StaticComponentProps = {
  instanceId: string
}

const StaticComponentComponent = ({ instanceId: id }: StaticComponentProps): React.ReactElement | null => {
  const {
    store: { elements, library },
    dispatch,
  } = useGraphManager()

  const componentRef = useRef<HTMLDivElement>(null)
  const selectionRef = useRef<HTMLDivElement>(null)

  const [status, color] = useElementStatus(id)

  const [[tx, ty], setOffset] = useState<[number, number]>([0, 0])

  useEffect(() => {
    if (!componentRef.current) {
      return
    }

    const { width, height } = componentRef.current.getBoundingClientRect()

    setOffset([width / 2, height / 2])
  }, [])

  const ready = useMemo(() => tx !== 0 && ty !== 0, [tx, ty])

  useEffect(() => {
    if (!selectionRef.current) {
      return
    }

    dispatch({ type: 'graph/register-element', ref: selectionRef, id })
  }, [ready])

  const moveAnchor = useRef<[number, number]>([0, 0])
  const moveActive = useRef<boolean>(false)

  const handleLongHover = (e: PointerEvent): void => {
    if (moveActive.current) {
      return
    }

    const { pageX, pageY } = e

    const tooltip = (
      <Tooltip
        component={library[template.category.toLowerCase()][template.subcategory.toLowerCase()].find(
          (t) => t.guid === template.guid
        )}
        onDestroy={() => dispatch({ type: 'tooltip/clear-tooltip' })}
      />
    )

    dispatch({ type: 'tooltip/set-tooltip', position: [pageX, pageY], content: tooltip })
  }

  const longHoverTarget = useLongHover(handleLongHover)

  const component = elements[id] as Glasshopper.Element.StaticComponent

  const { template, current } = component

  const [dx, dy] = current.position

  const captureMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation()
  }

  const pointerDownStart = useRef(0)

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>): void => {
    e.stopPropagation()

    pointerDownStart.current = Date.now()

    const { pageX: ex, pageY: ey } = e

    moveAnchor.current = [ex, ey]
    moveActive.current = true
  }

  const handlePointerMove = (e: PointerEvent): void => {
    if (!moveActive.current) {
      return
    }

    const { pageX: ex, pageY: ey } = e
    const [ax, ay] = moveAnchor.current

    const [dx, dy] = [ex - ax, ey - ay]

    // Dispatch move
    dispatch({ type: 'graph/mutation/move-component', id, motion: [dx, -dy] })

    moveAnchor.current = [ex, ey]
  }

  const handlePointerUp = (): void => {
    if (!moveActive.current) {
      return
    }

    moveActive.current = false
  }

  const handleLocalPointerUp = (): void => {
    const now = Date.now()

    const pointerDuration = now - pointerDownStart.current

    moveActive.current = false

    if (pointerDuration < 250) {
      dispatch({ type: 'graph/selection-clear' })
      dispatch({ type: 'graph/selection-add', id: id })
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  })

  if (!elements[id] || elements[id].template.type !== 'static-component') {
    console.error(`Mismatch with element '${id}' and attempted type 'static-component'`)
    return null
  }

  return (
    <div
      className="absolute flex flex-row items-stretch"
      style={{ left: dx - tx, top: -dy - ty, opacity: ready ? 1 : 0 }}
      ref={componentRef}
      onMouseDown={captureMouseDown}
      onPointerDown={handlePointerDown}
      onPointerUp={handleLocalPointerUp}
      role="presentation"
    >
      <div className="relative flex flex-row items-stretch">
        <div
          className="absolute w-8 h-4 flex justify-center overflow-visible z-30"
          style={{ top: '-1.2rem', right: '1rem' }}
        >
          <Loading visible={status === 'waiting'} />
        </div>
        <div
          id="input-grips-container"
          className="flex flex-col z-20"
          style={{ paddingTop: '2px', paddingBottom: '2px' }}
        >
          {Object.keys(current.inputs).map((parameterId) => (
            <div
              key={`input-grip-${parameterId}`}
              className="w-4 flex-grow flex flex-col justify-center"
              style={{ transform: 'translateX(50%)' }}
            >
              {ready ? <Grip source={{ element: id, parameter: parameterId }} /> : null}
            </div>
          ))}
        </div>
        <div
          id="panel-container"
          className="flex flex-row items-stretch rounded-md border-2 border-dark bg-light shadow-osm z-30"
          ref={selectionRef}
        >
          <div id="inputs-column" className="flex flex-col">
            {Object.entries(current.inputs).map(([parameterId, i]) => (
              <ComponentParameter
                key={`input-${parameterId}-${i}`}
                source={{ element: id, parameter: parameterId }}
                mode="input"
              />
            ))}
          </div>
          <div
            id="label-column"
            className="w-10 m-1 p-2 rounded-md border-2 border-dark flex flex-col justify-center items-center transition-colors duration-150"
            style={{ background: color }}
            ref={longHoverTarget}
          >
            <div
              className="font-panel text-v font-bold text-sm select-none"
              style={{ writingMode: 'vertical-lr', textOrientation: 'sideways', transform: 'rotate(180deg)' }}
            >
              {template.nickname.toUpperCase()}
            </div>
          </div>
          <div id="outputs-column" className="flex flex-col">
            {Object.entries(current.outputs).map(([parameterId, i]) => (
              <ComponentParameter
                key={`output-${parameterId}-${i}`}
                source={{ element: id, parameter: parameterId }}
                mode="output"
              />
            ))}
          </div>
        </div>
        <div
          id="output-grips-container"
          className="flex flex-col z-20"
          style={{ paddingTop: '2px', paddingBottom: '2px' }}
        >
          {Object.keys(current.outputs).map((parameterId) => (
            <div
              key={`output-grip-${parameterId}`}
              className="w-4 flex-grow flex flex-col justify-center"
              style={{ transform: 'translateX(-50%)' }}
            >
              {ready ? <Grip source={{ element: id, parameter: parameterId }} /> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const StaticComponent = React.memo(StaticComponentComponent)
