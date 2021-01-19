import React, { useMemo } from 'react'
import { Glasshopper, Grasshopper } from 'glib'
import { useGraphManager } from '@/context/graph'
import { graph } from '@/utils'
import { getValueCount } from '~/utils/graph'

type SourceTooltipProps = {
  wire: Glasshopper.Element.Wire
}

export const SourceTooltipContainer = ({ wire }: SourceTooltipProps): React.ReactElement => {
  const {
    store: { elements, library },
  } = useGraphManager()

  const {
    current: {
      sources: { from, to },
    },
  } = wire

  const getIcon = (element: Glasshopper.Element.StaticComponent): string => {
    const { category, subcategory, guid } = element.template

    const options = library[category.toLowerCase()][subcategory.toLowerCase()] as Grasshopper.Component[]

    const match = options.find((component) => component.guid === guid)

    return match?.icon ?? ''
  }

  const fromElement = useMemo(() => elements[from.element], [from]) as Glasshopper.Element.StaticComponent
  const fromElementIcon = useMemo(() => getIcon(fromElement), [fromElement])

  const toElement = useMemo(() => elements[to?.element], [to]) as Glasshopper.Element.StaticComponent
  const toElementIcon = useMemo(() => (toElement ? getIcon(toElement) : ''), [toElement])

  const fromType = graph.isInputOrOutput(fromElement, from.parameter)
  const [sourceElement, targetElement] = fromType === 'input' ? [toElement, fromElement] : [fromElement, toElement]

  const sourceElementParam =
    sourceElement?.template.type === 'static-component'
      ? fromType === 'input'
        ? to.parameter
        : from.parameter
      : 'output'

  const targetElementParam =
    targetElement?.template.type === 'static-component'
      ? fromType === 'input'
        ? from.parameter
        : to.parameter
      : 'output'

  return (
    <div className="m-4 p-2 pl-6 pr-6 flex flex-row items-center border-2 border-green bg-pale rounded-md">
      {sourceElement ? (
        <SourceTooltipSet source={sourceElement} parameter={sourceElementParam} icon={fromElementIcon} />
      ) : (
        <SourceTooltipUnset />
      )}
      <div className="w-8 h-8 ml-4 mr-4 border-2 border-green rounded-full bg-pale flex justify-center items-center">
        <svg width="18" height="18" viewBox="0 0 10 10" style={{ transform: 'rotate(-90deg)' }}>
          <polyline
            points="1,4 5,8 9,4"
            fill="none"
            stroke="#98E2C6"
            strokeWidth="2px"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {targetElement ? (
        <TargetTooltipSet target={targetElement} icon={toElementIcon} parameter={targetElementParam} />
      ) : (
        <SourceTooltipUnset />
      )}
    </div>
  )
}

type SourceTooltipSetProps = {
  source: Glasshopper.Element.StaticComponent | Glasshopper.Element.StaticParameter
  parameter: string
  icon: string
}

const SourceTooltipSet = ({ source, parameter, icon }: SourceTooltipSetProps): React.ReactElement => {
  const valueCount = getValueCount(source, parameter)

  return (
    <div className="flex items-stretch bg-pale">
      <div className="w-6 mr-2 flex flex-col justify-center">
        <img
          width="24px"
          height="24px"
          draggable="false"
          src={`data:image/png;base64,${icon}`}
          alt={source.template.type}
        />
      </div>
      <div className="flex flex-col justify-center">
        <p className="font-sans font-medium text-base text-darkgreen whitespace-no-wrap">
          {source.template.type === 'static-component' ? source.template.name : `${source.template.name} param`}
        </p>
        <p className="font-panel font-semibold text-xs text-darkgreen">
          {`${valueCount} value${valueCount === 1 ? '' : 's'}`}
        </p>
      </div>
    </div>
  )
}

const SourceTooltipUnset = (): React.ReactElement => {
  return (
    <div className="p-1 text-center border-2 border-green border-dashed rounded-sm">
      <p className="ml-4 mr-4 font-sans font-semibold text-darkgreen text-xs">Selecting...</p>
    </div>
  )
}

type TargetTooltipSetParams = {
  target: Glasshopper.Element.StaticComponent | Glasshopper.Element.StaticParameter
  parameter: string
  icon: string
}

const TargetTooltipSet = ({ target, parameter, icon }: TargetTooltipSetParams): React.ReactElement => {
  const [label, type] = ((): [string, string] => {
    switch (target.template.type) {
      case 'static-component': {
        const component = target as Glasshopper.Element.StaticComponent

        const param = component.template.inputs[component.current.inputs[parameter]]

        return [`${param.name} in ${component.template.nickname}`, param.type]
      }
      case 'static-parameter': {
        const param = target as Glasshopper.Element.StaticParameter

        return [`${param.template.name} param`, `${param.template.name}`]
      }
    }
  })()

  return (
    <div className="flex items-stretch bg-pale">
      <div className="w-6 mr-2 flex flex-col justify-center">
        <img
          width="24px"
          height="24px"
          draggable="false"
          src={`data:image/png;base64,${icon}`}
          alt={target.template.type}
        />
      </div>
      <div className="flex flex-col justify-center">
        <p className="font-sans font-medium text-base text-darkgreen whitespace-no-wrap">{label}</p>
        <p className="font-panel font-semibold text-xs text-darkgreen">{`${type} value`}</p>
      </div>
    </div>
  )
}
