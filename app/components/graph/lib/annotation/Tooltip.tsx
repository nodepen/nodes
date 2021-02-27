import React, { useEffect } from 'react'
import { Grasshopper, Glasshopper } from 'glib'
import { useGraphManager } from '@/context/graph'

type TooltipProps = {
  component?: Grasshopper.Component
  parameter?: Grasshopper.ComponentParameter
  data?: Glasshopper.Data.DataTree
}

type TooltipInfo = {
  icon: React.ReactNode
  title: string
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
        description: template.description,
      }
    } else {
      const icon = <img src={`data:image/png;base64,${template.icon}`} alt={description} className="w-6 h-6 mr-2" />

      return {
        icon,
        title: template.name,
        description: template.description,
      }
    }
  }

  const { icon, title, description } = getTooltipInfo(component ?? parameter)

  return (
    <div className="bg-white border-2 border-dark rounded-md p-2 flex flex-col">
      <div className="flex-grow flex justify-start items-center">
        {icon}
        <h4>{title}</h4>
      </div>
      <p>{description}</p>
    </div>
  )
}
