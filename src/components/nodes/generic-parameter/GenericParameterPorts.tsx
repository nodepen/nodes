import React from 'react'
import type * as NodePen from '@/types'
import GenericParameterPort from './GenericParameterPort'

const parameterOutputTemplate: NodePen.PortTemplate = {
  __order: 0,
  __direction: 'output',
  name: 'Output',
  nickName: 'O',
  description: '',
  typeName: '',
  keywords: [],
  isOptional: false
}

type GenericParameterPortsProps = {
  node: NodePen.DocumentNode
}

export const GenericParameterPorts = ({ node }: GenericParameterPortsProps) => {
  const { instanceId: id } = node

  return (
    <>
      <GenericParameterPort nodeInstanceId={id} portInstanceId='output' template={parameterOutputTemplate} />
    </>
  )
}
