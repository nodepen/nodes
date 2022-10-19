import React from 'react'
import { useStore } from '$'
import PseudoShadow from './PseudoShadow'

const PseudoShadowsContainer = (): React.ReactElement => {
  const shadowTargets = useStore((store) => Object.entries(store.registry.pseudoShadowTargets))

  return (
    <>
      {shadowTargets.map(([id, ref]) => (
        <PseudoShadow key={`np-shadow-${id}`} target={ref} />
      ))}
    </>
  )
}

export default React.memo(PseudoShadowsContainer)
