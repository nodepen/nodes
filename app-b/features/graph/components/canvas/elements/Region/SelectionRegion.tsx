import React, { useEffect, useRef } from 'react'
import { NodePen } from 'glib'
import { CommonRegion } from './lib'

type SelectionRegionProps = {
  region: NodePen.Element<'region'>
}

const SelectionRegion = ({ region }: SelectionRegionProps): React.ReactElement => {
  const { current, template } = region

  const { pointer } = template

  const {
    from: [fromX, fromY],
    to: [toX, toY],
    selection: mode,
  } = current

  const regionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Capture pointer
    if (!regionRef.current) {
      return
    }

    regionRef.current.setPointerCapture(pointer)
  }, [])

  // Watch pointer motion from here

  return (
    <div ref={regionRef}>
      <CommonRegion style={{}} />
    </div>
  )
}

export default React.memo(SelectionRegion)
