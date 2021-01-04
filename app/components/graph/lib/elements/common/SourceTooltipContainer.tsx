import React, { useMemo } from 'react'
import { Glasshopper, Grasshopper } from 'glib'
import { useGraphManager } from '@/context/graph'
import { graph } from '@/utils'
import { SourceTooltip } from '.'

type SourceTooltipProps = {
  wire: Glasshopper.Element.Wire
}

export const SourceTooltipContainer = ({ wire }: SourceTooltipProps): React.ReactElement => {
  const { store: { elements, library } } = useGraphManager()

  const { current: { sources: { from, to } } } = wire

  const getIcon = (element: Glasshopper.Element.StaticComponent): string => {
    const { category, subcategory, guid } = element.template

    const options = library[category.toLowerCase()][subcategory.toLowerCase()] as Grasshopper.Component[]

    const match = options.find((component) => component.guid === guid)

    return match?.icon ?? ''
  }

  const fromElement = useMemo(() => elements[from.element], [from]) as Glasshopper.Element.StaticComponent
  const fromElementIcon = useMemo(() => getIcon(fromElement), [fromElement])

  const toElement = useMemo(() => elements[to?.element], [to]) as Glasshopper.Element.StaticComponent
  const toElementIcon = useMemo(() => toElement ? getIcon(toElement) : '', [toElement])

  const fromType = graph.isInputOrOutput(fromElement, from.parameter)
  const [sourceElement, targetElement] = fromType === 'input' ? [toElement, fromElement] : [fromElement, toElement]

  const targetElementParam = targetElement?.template.type === 'static-component' ? Object.values(targetElement.template.inputs)[targetElement.current.inputs[fromType === 'input' ? from.parameter : to.parameter]].name : ''

  return (
    <div className="w-48 m-4 flex flex-col items-center">
      {sourceElement ? <SourceTooltipSet type={sourceElement.template.type} icon={fromElementIcon} values={sourceElement.current.values} /> : <SourceTooltipUnset />}
      <div className="w-full h-4 flex justify-center items-center overflow-visible bg-green z-20">
        <div className="w-8 h-8 border-2 border-green rounded-full bg-pale flex justify-center items-center">
          <svg width="18" height="18" viewBox="0 0 10 10" className="mt-1 animate-bounce">
            <polyline points="1,4 5,8 9,4" fill="none" stroke="#98E2C6" strokeWidth="2px" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {targetElement ? <TargetTooltipSet type={targetElement.template.type} icon={toElementIcon} element={targetElement.template.name} parameter={targetElementParam} /> : <SourceTooltipUnset />}
    </div>
  )
}

type SourceTooltipSetProps = {
  type: string
  icon: string
  values: any
}

const SourceTooltipSet = ({ type, icon, values }: SourceTooltipSetProps): React.ReactElement => {
  const valueCount = type === 'static-component' ? Object.values(values).reduce((count: number, paths) => (count + graph.getValueCount(paths as any)), 0) : graph.getValueCount(values)

  return (
    <div className="w-48 p-2 flex justify-center items-center bg-pale border-2 border-green rounded-sm">
      <img width="24px" height="24px" draggable="false" src={`data:image/png;base64,${icon}`} alt={type} />
      <p className="flex-grow ml-2 font-sans font-semibold text-green text-base">
        {`${valueCount} value${valueCount === 1 ? '' : 's'}`}
      </p>
    </div>
  )
}

const SourceTooltipUnset = (): React.ReactElement => {
  return (
    <div className="w-48 p-2 flex justify-center items-center bg-pale border-2 border-green rounded-sm">
      <div className="w-full p-1 text-center border-2 border-green border-dashed rounded-sm">
        <p className="font-sans font-semibold text-green text-xs">
          unset
        </p>
      </div>
    </div>
  )
}

type TargetTooltipSetParams = {
  type: string
  icon: string
  element: string
  parameter: string
}

const TargetTooltipSet = ({ type, icon, element, parameter }: TargetTooltipSetParams): React.ReactElement => {
  return (
    <div className="w-48 p-2 flex justify-center items-center bg-pale border-2 border-green rounded-sm">
      <img width="24px" height="24px" draggable="false" src={`data:image/png;base64,${icon}`} alt={type} />
      { type === 'static-component' ? (
        <>
          <p className="ml-2 mr-2 font-sans font-semibold text-green text-base">
            {parameter}
          </p>
          <p className="flex-grow ml-2 mr-2 font-sans font-light text-green text-base">
            {`in ${element}`}
          </p>
        </>
      ) : (
          <p className="flex-grow ml-2 mr-2 font-semibold text-green text-base">
            {`${element} param`}
          </p>
        )}

    </div>
  )
}