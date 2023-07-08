import React from 'react'
import type { NodesAppState } from '$'
import { useStore } from '$'
import { COLORS } from '@/constants'
import { ControlPanel, ControlPanelHeader } from '../../common'
import { PortTypeIcon } from '@/components/icons'

/**
 * Surfaces "pinned ports" in controls overlay for direct interaction.
 */
export const PinnedPortsControl = (): React.ReactElement => {
  const pinnedPorts = useStore((state) => state.document.configuration.pinnedPorts)

  const icon = (
    <svg
      width={24}
      aria-hidden="true"
      fill="none"
      stroke={COLORS.DARKGREEN}
      strokeWidth={2}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
  return (
    <ControlPanel>
      <ControlPanelHeader icon={icon} label="Pinned Inputs" onClickMenu={() => ''} />
      {/* <div className="np-w-full np-flex np-justify-between np-items-center">
        <h3 className="np-mb-1 np-font-sans np-text-md np-text-darkgreen">Pinned Controls</h3>
        <div className="np-h-full np-w-4 np-flex np-flex-col np-justify-center np-items-center">
          <svg width={8} height={4} viewBox="0 0 10 5" className="np-overflow-visible">
            <polyline
              points="0,0 5,5 10,0"
              fill="none"
              stroke={COLORS.DARKGREEN}
              strokeWidth="2px"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div> */}
      {pinnedPorts.length === 0 ? (
        <div className="np-w-full np-h-8 np-border-swampgreen np-border-2 np-rounded-sm np-border-dashed" />
      ) : null}
      {pinnedPorts.map((port, _i) => {
        const { nodeInstanceId, portInstanceId } = port
        return <PortControl key={`port-control-${nodeInstanceId}-${portInstanceId}`} portReference={port} />
      })}
    </ControlPanel>
  )
}

import { useDispatch } from '$'
import { shallow } from 'zustand/shallow'
import { tryGetSingleValue } from '@/utils/data-trees'

type PortControlProps = {
  portReference: NodesAppState['document']['configuration']['pinnedPorts'][0]
}

const PortControl = ({ portReference }: PortControlProps): React.ReactElement | null => {
  const { nodeInstanceId, portInstanceId } = portReference

  const solutionValues = useStore.getState().solution.values[nodeInstanceId]?.[portInstanceId] ?? {}

  const { apply } = useDispatch()

  const node = useStore((store) => store.document.nodes[nodeInstanceId])
  const templates = useStore((store) => store.templates, shallow)

  const nodeTemplate = templates?.[node?.templateId]
  const portTemplate = nodeTemplate?.inputs[node.inputs[portInstanceId]]

  if (!nodeTemplate || !portTemplate) {
    return null
  }

  const currentValue = tryGetSingleValue(node.values[portInstanceId]) ?? tryGetSingleValue(solutionValues)

  const { name } = portTemplate

  const valueString = currentValue?.description

  return (
    <div className="np-relative np-w-full np-h-8 np-mt-3 first:np-mt-0 np-bg-pale np-rounded-sm">
      <div
        className="np-absolute np-h-8 np-w-8 np-flex np-justify-center np-items-center"
        style={{ left: 0, top: 0, zIndex: 20 }}
      >
        <PortTypeIcon />
      </div>
      <div
        className="np-absolute np-h-8 np-flex np-justify-start np-items-center"
        style={{ left: 32, top: 0, zIndex: 20 }}
      >
        <h4 className="np-font-sans np-text-xs np-text-dark np-select-none">{name}</h4>
      </div>
      <input
        className="np-absolute np-w-full np-h-full np-pr-2 np-font-sans np-text-md np-text-dark np-text-right np-bg-pale np-shadow-input"
        type="text"
        defaultValue={valueString}
        style={{ left: 0, top: 0, zIndex: 10 }}
        onBlur={(e) => {
          const value = Number.parseInt(e.target.value)

          apply((state) => {
            state.document.nodes[nodeInstanceId].values[portInstanceId] = {
              '{0}': [
                {
                  type: 'number',
                  description: value.toString(),
                  value: value,
                },
              ],
            }

            state.solution.id = crypto.randomUUID()
          })
        }}
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
