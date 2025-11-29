import React from 'react'
import type { NodesAppState } from '$'
import { useStore } from '$'
import { COLORS } from '@/constants'
import { ControlPanel, ControlPanelHeader } from '../../common'
import { PortTypeIcon } from '@/components/icons'

/**
 * Surfaces "pinned outputs" in controls overlay for direct interaction.
 */
export const PinnedOutputsControl = (): React.ReactElement => {
  const outputsPorts = useStore((state) => state.document.configuration.outputs)

  const outputsIcon = (
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
        d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  )

  return (
    <ControlPanel>
      <ControlPanelHeader icon={outputsIcon} label="Outputs" onClickMenu={() => ''} />
      {outputsPorts.map((port, _i) => {
        const { nodeInstanceId, portInstanceId } = port
        return <PortControl key={`port-control-${nodeInstanceId}-${portInstanceId}`} portReference={port} />
      })}
    </ControlPanel>
  )
}

import { useDispatch } from '$'
import { shallow } from 'zustand/shallow'
import { tryGetSingleValue } from '@/utils/data-trees'
import { expireSolution } from '@/store/utils'

type PortControlProps = {
  portReference: NodesAppState['document']['configuration']['inputs'][0]
}

const PortControl = ({ portReference }: PortControlProps): React.ReactElement | null => {
  const { nodeInstanceId, portInstanceId } = portReference

  const solutionValues = useStore
    .getState()
    .solution.nodeSolutionData?.find(({ nodeInstanceId: id }) => id === nodeInstanceId)
    ?.portSolutionData?.find(({ portInstanceId: id }) => id === portInstanceId)

  const { apply } = useDispatch()

  const node = useStore((store) => store.document.nodes[nodeInstanceId])
  const templates = useStore((store) => store.templates, shallow)

  const nodeTemplate = templates?.[node?.templateId]
  const portTemplate = nodeTemplate?.inputs[node.inputs[portInstanceId]]

  if (!nodeTemplate || !portTemplate) {
    return null
  }

  const currentValue = tryGetSingleValue(node.values[portInstanceId]) ?? tryGetSingleValue(solutionValues?.dataTree)

  const { name } = portTemplate

  const valueString = currentValue?.description

  const handleApplyValue = (value: number): void => {
    apply((state) => {
      state.document.nodes[nodeInstanceId].values[portInstanceId] = {
        branches: [
          {
            order: 0,
            path: '{0}',
            values: [
              {
                type: 'number',
                description: value.toString(),
                order: 0,
                value: value.toString(),
              },
            ],
          },
        ],
        stats: {
          branchCount: 1,
          branchValueCountDomain: [1, 1],
          treeStructure: 'single',
          valueTypes: ['number'],
          valueCount: 1,
        },
      }

      expireSolution(state)
    })
  }

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
        placeholder={portTemplate.typeName}
        style={{ left: 0, top: 0, zIndex: 10 }}
        onBlur={(e) => {
          const value = Number.parseInt(e.target.value)
          handleApplyValue(value)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const target = e.target as HTMLInputElement
            target?.blur()
          }
        }}
      />
    </div>
  )
}
