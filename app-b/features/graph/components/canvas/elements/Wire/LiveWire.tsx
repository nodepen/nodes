import React, { useEffect } from 'react'
import { NodePen } from 'glib'
import Wire from './Wire'
import { useLiveWireMotion } from './hooks'
import { LiveWireTooltip } from './tooltip'
import { useGraphDispatch, useGraphPrimaryLiveWire } from 'features/graph/store/graph/hooks'

type WireProps = {
  wire: NodePen.Element<'wire'>
}

const LiveWire = ({ wire }: WireProps): React.ReactElement => {
  const { endLiveWires } = useGraphDispatch()
  const primaryId = useGraphPrimaryLiveWire()

  const initialMode = wire.template.mode === 'live' ? wire.template.initial.mode : 'default'
  const initialPointer = wire.template.mode === 'live' ? wire.template.initial.pointer : 0

  const allowTranspose = wire.template.mode === 'live' && wire.template.transpose

  const mode = useLiveWireMotion(initialMode, initialPointer, allowTranspose)

  useEffect(() => {
    if (mode !== 'transpose' && allowTranspose) {
      endLiveWires('cancel')
    }
  })

  return (
    <>
      {wire.id === primaryId ? (
        <LiveWireTooltip initialPosition={[0, 0]} initialPointer={initialPointer} mode={mode} />
      ) : null}
      <Wire wire={wire} />
    </>
  )
}

export default React.memo(LiveWire)
