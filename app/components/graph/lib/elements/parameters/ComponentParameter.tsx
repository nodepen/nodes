import React from 'react'
import { Glasshopper } from 'glib'
import { useGraphManager } from '@/context/graph'

type ComponentParameterProps = {
  source: {
    element: string
    parameter: string
  }
  mode: 'input' | 'output'
}

export const ComponentParameter = ({ source, mode }: ComponentParameterProps): React.ReactElement => {
  const {
    store: { elements },
  } = useGraphManager()

  const element = elements[source.element] as Glasshopper.Element.StaticComponent

  const parameterIndex = element.current[mode === 'input' ? 'inputs' : 'outputs'][source.parameter]
  const parameter = element.template[mode === 'input' ? 'inputs' : 'outputs'][parameterIndex]

  const { nickName } = parameter

  return <div className="min-h-10 flex-grow flex flex-row items-center">{nickName}</div>
}
