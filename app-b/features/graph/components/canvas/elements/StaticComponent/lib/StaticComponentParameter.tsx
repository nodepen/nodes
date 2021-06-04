import { NodePen, Grasshopper } from 'glib'
import React, { useEffect, useMemo, useRef } from 'react'
import { useSetCameraPosition } from 'features/graph/hooks'
import { useDebugRender } from '@/hooks'
import { useCameraStaticPosition, useCameraStaticZoom, useGraphDispatch } from 'features/graph/store/hooks'
import { screenSpaceToCameraSpace } from 'features/graph/utils'

type StaticComponentParameterProps = {
  parent: NodePen.Element<'static-component'>
  template: Grasshopper.Parameter & { id: string }
  mode: 'input' | 'output'
}

const StaticComponentParameter = ({ parent, template, mode }: StaticComponentParameterProps): React.ReactElement => {
  const { current, id: elementId } = parent
  const { name, nickname, type, id: parameterId } = template

  useDebugRender(`StaticComponentParameter | ${parent.template.name} | ${name} | ${parameterId}`)

  const { registerElementAnchor } = useGraphDispatch()
  const cameraZoom = useCameraStaticZoom()
  const cameraPosition = useCameraStaticPosition()
  const setCameraPosition = useSetCameraPosition()

  const gripRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!gripRef.current) {
      return
    }

    const { width, height, left, top } = gripRef.current.getBoundingClientRect()

    const [sx, sy] = [left + width / 2, top + height / 2]

    const [x, y] = screenSpaceToCameraSpace(
      { offset: [0, 48 + 36], position: [sx, sy] },
      { zoom: cameraZoom, position: cameraPosition }
    )

    const [ex, ey] = current.position
    const [dx, dy] = [x - ex, y - ey]

    registerElementAnchor({ elementId, anchorId: parameterId, position: [dx, dy] })
  }, [])

  const grip = useMemo(() => {
    const tx = mode === 'input' ? 'translateX(-9px)' : 'translateX(9px)'
    const d = mode === 'input' ? 'M5,2 a1,1 0 0,0 0,8' : 'M5,10 a1,1 0 0,0 0,-8'

    return (
      <svg ref={gripRef} className="w-4 h-4 overflow-visible" viewBox="0 0 10 10" style={{ transform: tx }}>
        <path d={d} fill="#333" stroke="#333" strokeWidth="2px" vectorEffect="non-scaling-stroke" />
        <circle cx="5" cy="5" r="4" stroke="#333" strokeWidth="2px" vectorEffect="non-scaling-stroke" fill="#FFF" />
      </svg>
    )
  }, [mode])

  const body = useMemo(() => {
    return mode === 'input' ? (
      <>
        {grip}
        <p>{nickname}</p>
      </>
    ) : (
      <>
        <p>{nickname}</p>
        {grip}
      </>
    )
  }, [grip, mode, nickname])

  const border = mode === 'input' ? 'border-l-2 rounded-tr-md rounded-br-md' : 'border-r-2 rounded-tl-md rounded-bl-md'
  const p = mode === 'input' ? 'pr-4' : 'pl-4'

  const handleClick = (): void => {
    const [x, y] = current.position
    const [dx, dy] = current.anchors[parameterId]

    setCameraPosition(x + dx, y + dy, mode === 'input' ? 'TR' : 'TL', 45)
  }

  return (
    <button
      className={`${p} ${border} flex-grow pt-2 pb-2 flex flex-row justify-start items-center border-dark transition-colors duration-75 hover:bg-gray-300`}
      onClick={handleClick}
    >
      {body}
    </button>
  )
}

export default React.memo(StaticComponentParameter)
