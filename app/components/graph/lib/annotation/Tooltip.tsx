import React from 'react'
import { Grasshopper, Glasshopper } from 'glib'

type TooltipProps = {
  component?: Grasshopper.Component
  parameter?: Grasshopper.ComponentParameter
  data?: Glasshopper.Data.DataTree
}

type TooltipInfo = {
  icon: string
  title: string
  description: string
}

export const Tooltip = ({ component, parameter, data }: TooltipProps): React.ReactElement => {
  const getTooltipInfo = (template: Grasshopper.Component | Grasshopper.ComponentParameter): TooltipInfo => {
    const isComponentParameter = (
      template: Grasshopper.Component | Grasshopper.ComponentParameter
    ): template is Grasshopper.ComponentParameter => {
      return 'type' in template
    }

    if (isComponentParameter(template)) {
      return {
        icon: '',
        title: template.name,
        description: template.description,
      }
    } else {
      return {
        icon: template.icon,
        title: template.name,
        description: template.description,
      }
    }
  }

  const { icon, title, description } = getTooltipInfo(component ?? parameter)

  return (
    <div className="bg-white border-2 border-dark rounded-md p-2 flex flex-col">
      <div className="flex-grow flex justify-start items-center">
        <img src={icon} alt={description} />
        <h4>{title}</h4>
      </div>
      <p>{description}</p>
    </div>
  )
}
