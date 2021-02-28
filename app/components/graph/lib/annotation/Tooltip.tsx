import React, { useEffect } from 'react'
import { Grasshopper, Glasshopper } from 'glib'
import { useGraphManager } from '@/context/graph'
import { getFlattenedValues, valueToString } from '@/utils/data'

type TooltipProps = {
  component?: Grasshopper.Component
  parameter?: Grasshopper.ComponentParameter
  data?: Glasshopper.Data.DataTree
}

type TooltipInfo = {
  icon: React.ReactNode
  title: string
  subtitle?: string
  description: string
}

export const Tooltip = ({ component, parameter, data }: TooltipProps): React.ReactElement => {
  const { dispatch } = useGraphManager()

  useEffect(() => {
    const handlePointerMove = (): void => {
      dispatch({ type: 'tooltip/clear-tooltip' })
    }

    window.addEventListener('pointermove', handlePointerMove)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
    }
  })

  const getTooltipInfo = (template: Grasshopper.Component | Grasshopper.ComponentParameter): TooltipInfo => {
    const isComponentParameter = (
      template: Grasshopper.Component | Grasshopper.ComponentParameter
    ): template is Grasshopper.ComponentParameter => {
      return 'type' in template
    }

    if (isComponentParameter(template)) {
      const icon = <svg width="24" height="24" className="mr-2 bg-gray-300"></svg>

      return {
        icon,
        title: template.name,
        subtitle: template.nickname,
        description: template.description,
      }
    } else {
      const icon = <img src={`data:image/png;base64,${template.icon}`} alt={description} className="w-6 h-6 mr-2" />

      return {
        icon,
        title: template.name,
        subtitle: template.nickname,
        description: template.description,
      }
    }
  }

  const { icon, title, subtitle, description } = getTooltipInfo(component ?? parameter)

  const values = data ? getFlattenedValues(data).map((value) => valueToString(value)) : []

  return (
    <div className="bg-white border-2 border-dark rounded-md p-1 flex flex-col w-56">
      <div className="p-1 flex flex-col">
        <div className="mb-1 flex-grow flex justify-start items-center whitespace-no-wrap overflow-hidden">
          {icon}
          <h4 className="font-sans font-medium text-lg">{title}</h4>
          {subtitle ? <h4 className="ml-2 font-sans text-lg">{subtitle}</h4> : null}
        </div>
        <p className="font-sans font-normal text-sm leading-tight">{description}</p>
      </div>
      {parameter ? (
        <div className="mt-1 p-2 flex flex-col bg-dark rounded-md">
          <p className={`${values.length > 0 ? 'mb-1' : ''} font-panel text-xs font-medium text-light`}>
            {data ? `${values.length} value${values.length === 1 ? '' : 's'}...` : 'No values'}
          </p>
          {values.slice(0, 5).map((value, i) => (
            <p
              key={`tooltip-value-${i}`}
              className="font-panel text-xs font-medium text-light whitespace-no-wrap overflow-hidden"
            >
              {value}
            </p>
          ))}
          {values.length > 5 ? (
            <>
              <p className="font-panel text-xs font-medium text-light">...</p>
              <p className="font-panel text-xs font-medium text-light whitespace-no-wrap overflow-hidden">
                {values[values.length - 1]}
              </p>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
