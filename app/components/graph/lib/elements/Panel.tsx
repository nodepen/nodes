import React, { useRef, useEffect } from 'react'
import { Glasshopper } from 'glib'
import { useGraphManager } from '@/context/graph'
import { Grip, DataTree } from './common'
import { useMoveableElement, useSelectableElement } from './utils'
import { hotkey } from '@/utils'

type PanelProps = {
  instanceId: string
}

export const Panel = ({ instanceId: id }: PanelProps): React.ReactElement => {
  const {
    store: { elements, selected, activeKeys },
    dispatch,
  } = useGraphManager()

  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!panelRef.current) {
      return
    }

    dispatch({ type: 'graph/register-element', id, ref: panelRef })
  }, [])

  const color = selected.includes(id) ? '#98E2C6' : '#FFFFFF'

  const panel = elements[id] as Glasshopper.Element.Panel

  const source = panel.current.sources['input'].length > 0 ? panel.current.sources['input'][0] : undefined

  const getValues = (): Glasshopper.Data.DataTree | undefined => {
    if (!source) {
      return undefined
    }

    const element = elements[source.element]

    switch (element.template.type) {
      case 'static-parameter': {
        const parameter = element as Glasshopper.Element.StaticParameter
        return parameter.current.values
      }
      case 'static-component': {
        const component = element as Glasshopper.Element.StaticComponent
        return component.current.values[source.parameter]
      }
      case 'number-slider': {
        const slider = element as Glasshopper.Element.NumberSlider
        return slider.current.values
      }
    }
  }

  const values = getValues()

  const { current } = panel

  const [dx, dy] = current.position

  const label = source ? (elements[source.element].template as any).nickname : 'N/A'

  const captureMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation()
  }

  const activeRef = useRef<HTMLDivElement>(null)

  const onMove = (motion: [number, number]): void => {
    dispatch({ type: 'graph/mutation/move-component', motion, id })
  }

  useMoveableElement(onMove, undefined, undefined, activeRef)

  const onSelect = (): void => {
    switch (hotkey.selectionMode(activeKeys)) {
      case 'replace': {
        dispatch({ type: 'graph/selection-clear' })
        dispatch({ type: 'graph/selection-add', id })
        break
      }
      case 'remove': {
        dispatch({ type: 'graph/selection-remove', id })
        break
      }
      case 'add': {
        dispatch({ type: 'graph/selection-add', id })
        break
      }
    }
  }

  useSelectableElement(onSelect, activeRef)

  if (!elements[id]) {
    console.error(`Element '${id}' does not exist.'`)
    return null
  }

  return (
    <div
      className="absolute flex flex-row"
      style={{ left: dx - 100, top: -dy - 128 }}
      onMouseDown={captureMouseDown}
      ref={panelRef}
      role="presentation"
    >
      <div id="grip-column" className="w-2 h-64 flex flex-col justify-center z-20">
        <Grip source={{ element: id, parameter: 'input' }} />
      </div>
      <div ref={activeRef} className="h-full flex flex-row items-center">
        <div
          className={`w-8 h-64 border-2 border-dark rounded-tl-md rounded-bl-md shadow-osm transition-colors duration-150 z-30`}
          style={{ background: color }}
        />
        <div
          className={`w-40 h-64 p-2 pt-1 bg-pale border-2 border-green rounded-tr-md rounded-br-md overflow-hidden`}
          style={{ transform: 'translateY(2px)' }}
        >
          {values ? (
            <DataTree data={values} label={label} />
          ) : (
            <div className="w-full h-full mt-1 rounded-sm border-2 border-dashed border-green" />
          )}
        </div>
      </div>
    </div>
  )
}
