import React from 'react'
import type { RootStore } from '$'
import { COLORS } from '@/constants'

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
      <h3 className="np-mb-3 np-font-sans np-text-md np-text-darkgreen">Polygon Controls</h3>
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
    <div className="np-relative np-w-full np-h-8 np-mb-3 np-bg-pale np-rounded-sm">
      <div
        className="np-absolute np-h-8 np-w-8 np-flex np-justify-center np-items-center"
        style={{ left: 0, top: 0, zIndex: 20 }}
      >
        <NodeTypeIcon />
      </div>
      <div
        className="np-absolute np-h-8 np-flex np-justify-start np-items-center"
        style={{ left: 32, top: 0, zIndex: 20 }}
      >
        <h4 className="np-font-sans np-text-sm np-text-dark np-select-none">{name}</h4>
      </div>
      <input
        className="np-absolute np-w-full np-h-full np-pr-2 np-font-sans np-text-md np-text-dark np-text-right np-bg-none np-shadow-input"
        type="text"
        defaultValue={valueString}
        style={{ left: 0, top: 0, zIndex: 10 }}
      />
    </div>
    // <div className="np-mb-2 np-w-full np-flex np-flex-col">
    //   <h1>{name}</h1>
    //   <p>
    //     {nickName} : {typeName}
    //   </p>
    //   <p>{valueString}</p>
    // </div>
  )
}

const NodeTypeIcon = (): React.ReactElement => {
  const r = 20

  const px = `${r}px`
  const s = r / 2

  const a = s
  const b = s / 2
  const f = (Math.sqrt(3) / 2) * s
  const points = `${a},0 ${b},-${f} -${b},-${f} -${a},0 -${b},${f} ${b},${f}`

  return (
    <div>
      <svg width={px} height={px} viewBox={`0 0 ${s * 2} ${s * 2}`}>
        <defs>
          <clipPath id="annoying">
            <polygon points={points} />
          </clipPath>
        </defs>
        <polygon
          points={points}
          stroke={COLORS.DARK}
          strokeWidth="4px"
          fill={COLORS.DARK}
          vectorEffect="non-scaling-stroke"
          clipPath="url(#annoying)"
          style={{ transform: `translate(${s}px, ${s}px)` }}
        />
      </svg>
    </div>
  )
}
