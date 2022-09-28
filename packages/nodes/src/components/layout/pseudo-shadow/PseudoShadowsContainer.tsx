import React from 'react'
import { useStore } from '$'
import PseudoShadow from './PseudoShadow'

const PseudoShadowsContainer = (): React.ReactElement => {
  const shadowTargets = useStore((store) => Object.values(store.registry.pseudoShadowTargets))

  return (
    <>
      {shadowTargets.map((ref) => (
        <PseudoShadow target={ref} />
      ))}
    </>
  )
}

export default React.memo(PseudoShadowsContainer)
