import React, { useEffect, useState, useRef } from 'react'
import { Grasshopper, Glasshopper } from 'glib'
import { getFlattenedValues, valueToString } from '@/utils/data'

type TooltipProps = {
  component?: Grasshopper.Component
  parameter?: Grasshopper.ComponentParameter
  data?: Glasshopper.Data.DataTree
  runtimeMessage?: {
    message: string
    level: 'error' | 'warning' | 'info'
  }
  onDestroy: () => void
}

type TooltipInfo = {
  icon: React.ReactNode
  title: string
  subtitle?: string
  description: string
}

type CornerType = 'TL' | 'TR' | 'BL' | 'BR'

export const Tooltip = ({
  component,
  parameter,
  data,
  runtimeMessage,
  onDestroy,
}: TooltipProps): React.ReactElement => {
  const tooltipRef = useRef<HTMLDivElement>(null)

  const [transform, setTransform] = useState<[number, number]>()

  useEffect(() => {
    if (!tooltipRef.current) {
      setTransform([0, 0])
      return
    }

    const { innerWidth, innerHeight } = window
    const { width, height, top, left } = tooltipRef.current.getBoundingClientRect()

    const vertical = top > innerHeight / 2 ? 'B' : 'T'
    const horizontal = left > innerWidth * 0.75 ? 'R' : 'L'

    const corner = `${vertical}${horizontal}` as CornerType

    switch (corner) {
      case 'TL': {
        setTransform([0, 0])
        break
      }
      case 'TR': {
        setTransform([-width, 0])
        break
      }
      case 'BL': {
        setTransform([0, -height])
        break
      }
      case 'BR': {
        setTransform([-width, -height])
        break
      }
      default: {
        setTransform([0, 0])
      }
    }
  }, [])

  useEffect(() => {
    const handlePointerMove = (): void => {
      onDestroy()
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
      const f = Math.sqrt(3) / 2
      const points = `1,0 0.5,-${f} -0.5,-${f} -1,0 -0.5,${f} 0.5,${f}`
      const icon = (
        <svg width="24px" height="24px" viewBox="-1 -1 2 2" className="mr-2">
          <defs>
            <clipPath id="annoying">
              <polygon points={points} />
            </clipPath>
          </defs>
          <polygon
            points={points}
            stroke="#333333"
            strokeWidth="4px"
            fill="#FFFFFF"
            vectorEffect="non-scaling-stroke"
            clipPath="url(#annoying)"
          />
        </svg>
      )

      return {
        icon,
        title: template.name,
        subtitle: template.type,
        description: template.description,
      }
    } else {
      const icon = <img src={`data:image/png;base64,${template.icon}`} alt={description} className="w-6 h-6 mr-2" />

      return {
        icon,
        title: template.name,
        subtitle: undefined,
        description: template.description,
      }
    }
  }

  const { icon, title, subtitle, description } = getTooltipInfo(component ?? parameter)

  const values = data ? getFlattenedValues(data).map((value) => valueToString(value)) : []

  const [tx, ty] = transform ?? [0, 0]

  return (
    <div
      className="w-56 flex flex-col"
      ref={tooltipRef}
      style={{ opacity: transform ? 1 : 0, transform: `translate(${tx}px, ${ty}px)` }}
    >
      <div className="bg-white border-2 border-dark rounded-md p-1 flex flex-col w-56">
        <div className="p-1 flex flex-col">
          <div className="mb-1 flex-grow flex justify-start items-center whitespace-no-wrap overflow-hidden">
            {icon}
            <h4 className="font-sans font-medium text-lg">{title}</h4>
            {subtitle ? (
              <div className="h-full flex-grow flex justify-end overflow-hidden items-center whitespace-no-wrap">
                <h4 className="ml-2 font-sans text-lg">{subtitle}</h4>
              </div>
            ) : null}
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
      {runtimeMessage ? (
        <div className="bg-white border-2 border-dark rounded-md mt-2 flex flex-col w-56 overflow-hidden">
          <div
            className={`${
              runtimeMessage.level.toLowerCase() == 'error' ? 'border-error' : 'border-warn'
            } border-2 p-2 w-full h-full flex flex-col`}
          >
            <p className="font-sans font-normal text-sm leading-tight">{runtimeMessage.message}</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
