import React, { useRef, useEffect, useState, useMemo } from 'react'
import { Glasshopper } from 'glib'
import { Grip } from './common'
import { ComponentParameter } from './parameters'
import { useGraphManager } from '@/context/graph'

type StaticComponentProps = {
  instanceId: string
}

export const StaticComponent = ({ instanceId: id }: StaticComponentProps): React.ReactElement | null => {
  const {
    store: { elements },
  } = useGraphManager()

  const componentRef = useRef<HTMLDivElement>(null)

  const [[tx, ty], setOffset] = useState<[number, number]>([0, 0])

  useEffect(() => {
    if (!componentRef.current) {
      return
    }

    const { width, height } = componentRef.current.getBoundingClientRect()

    setOffset([width / 2, height / 2])
  }, [])

  const ready = useMemo(() => tx !== 0 && ty !== 0, [tx, ty])

  if (!elements[id] || elements[id].template.type !== 'static-component') {
    console.error(`Mismatch with element '${id}' and attempted type 'static-component'`)
    return null
  }

  const { template, current } = elements[id] as Glasshopper.Element.StaticComponent

  const [dx, dy] = current.position

  return (
    <div
      className="absolute flex flex-row items-stretch"
      style={{ left: dx - tx, top: -dy - ty, opacity: ready ? 1 : 0 }}
      ref={componentRef}
    >
      <div
        id="input-grips-container"
        className="flex flex-col z-10"
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
        className="flex flex-row items-stretch rounded-md border-2 border-dark bg-light shadow-osm z-20"
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
          className="w-8 m-4 mt-1 mb-1 p-2 rounded-md border-2 border-dark flex flex-col justify-center items-center"
        >
          <div
            className="font-panel text-v"
            style={{ writingMode: 'vertical-lr', textOrientation: 'sideways', transform: 'rotate(180deg)' }}
          >
            {template.nickname}
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
        className="flex flex-col z-10"
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
  )

  // return (
  //   <div
  //     className="block text-lg font-panel absolute"
  //     style={{ left: dx, top: -dy }}
  //   >{`${template.name} (${dx}, ${dy})`}</div>
  // )
}
