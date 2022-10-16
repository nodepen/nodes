import React from 'react'
import type { RootStore } from '$'

type PinnedPortsControlProps = {
  configuration: RootStore['document']['configuration']
}

/**
 * Surfaces "pinned ports" in controls overlay for direct interaction.
 */
export const PinnedPortsControl = ({ configuration }: PinnedPortsControlProps): React.ReactElement => {
  const { pinnedPorts } = configuration

  return (
    <>
      {pinnedPorts.map((port, _i) => {
        const { nodeInstanceId, portInstanceId } = port
        return <PortControl key={`port-control-${nodeInstanceId}-${portInstanceId}`} portReference={port} />
      })}
    </>
  )
}

import { useStore } from '$'
import shallow from 'zustand/shallow'
import { getDataTreeValueString, tryGetSingleValue } from '@/utils/data'

type PortControlProps = {
  portReference: RootStore['document']['configuration']['pinnedPorts'][0]
}

const PortControl = ({ portReference }: PortControlProps): React.ReactElement | null => {
  const { nodeInstanceId, portInstanceId } = portReference

  const node = useStore((store) => store.document.nodes[nodeInstanceId])
  const templates = useStore((store) => store.templates, shallow)

  const nodeTemplate = templates?.[node?.templateId]
  const portTemplate = nodeTemplate?.inputs[node.inputs[portInstanceId]]

  if (!nodeTemplate || !portTemplate) {
    return null
  }

  const currentValue = tryGetSingleValue(node.values[portInstanceId])

  const { name, nickName, typeName } = portTemplate

  const valueString = getDataTreeValueString(currentValue)

  return (
    <div className="np-mb-2 np-w-full np-flex np-flex-col">
      <h1>{name}</h1>
      <p>
        {nickName} : {typeName}
      </p>
      <p>{valueString}</p>
    </div>
  )
}
