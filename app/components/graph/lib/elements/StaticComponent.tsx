import React, { useRef, useEffect, useState } from 'react'
import { Glasshopper } from 'glib'
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

  useEffect(() => {
    // Only register anchors after offset has been calculated
    if (!componentRef.current || tx === 0) {
      return
    }

    console.log(`Registering with offset ${tx},${ty}`)
  }, [tx, ty])

  if (!elements[id] || elements[id].template.type !== 'static-component') {
    console.error(`Mismatch with element '${id}' and attempted type 'static-component'`)
    return null
  }

  const { template, current } = elements[id] as Glasshopper.Element.StaticComponent

  const [dx, dy] = current.position

  return (
    <div
      className="absolute flex flex-row items-stretch"
      style={{ left: dx - tx, top: -dy - ty, opacity: tx === 0 ? 0 : 1 }}
      ref={componentRef}
    >
      <div id="inputs-column" className="flex flex-col justify-center">
        {Object.entries(current.inputs).map(([id, i]) => (
          <div key={`input-${id}-${i}`}>{template.inputs[i].nickName}</div>
        ))}
      </div>
      <div id="label-column" className="m-4 flex flex-col justify-center items-center">
        {template.nickname}
      </div>
      <div id="outputs-column" className="flex flex-col justify-center">
        {Object.entries(current.outputs).map(([id, i]) => (
          <div key={`output-${id}-${i}`}>{template.outputs[i].nickName}</div>
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
