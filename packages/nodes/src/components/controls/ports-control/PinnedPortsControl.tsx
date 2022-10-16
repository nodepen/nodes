import React from 'react'
import type { RootStore } from '$'

type PortsControlProps = {
  configuration: RootStore['document']['configuration']
}

/**
 * Surfaces "pinned ports" in controls overlay for direct interaction.
 */
export const PortsControl = ({ configuration }: PortsControlProps): React.ReactElement => {
  const { pinnedPorts } = configuration

  return <></>
}

export default React.memo(PortsControl)
