import React from 'react'
import { NodePen } from 'glib'
import Wire from './Wire'
import { useLiveWireMotion } from './hooks'
import { LiveWireTooltip } from './tooltip'
import { useGraphPrimaryLiveWire } from 'features/graph/store/graph/hooks'

type WireProps = {
  wire: NodePen.Element<'wire'>
}

const LiveWire = ({ wire }: WireProps): React.ReactElement => {
  const primaryId = useGraphPrimaryLiveWire()

  const initialMode = wire.template.mode === 'live' ? wire.template.initial.mode : 'default'
  const initialPointer = wire.template.mode === 'live' ? wire.template.initial.pointer : 0

  const isTranspose = wire.template.mode === 'live' && wire.template.transpose
  const isPrimary = wire.id === primaryId

  const mode = useLiveWireMotion(initialMode, initialPointer, isTranspose, isPrimary)

  return (
    <>
      {isPrimary ? <LiveWireTooltip initialPosition={[0, 0]} initialPointer={initialPointer} mode={mode} /> : null}
      <Wire wire={wire} />
    </>
  )
}

export default React.memo(LiveWire)
