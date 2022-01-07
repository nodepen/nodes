import { Grasshopper } from 'glib'
import { useGenericMenuManager } from 'features/graph/components/overlay/GenericMenu/hooks'
import React from 'react'
import { useDebugRender } from 'hooks'
import { useGraphManager } from '@/features/graph/context/graph'

type AboutMenuProps = {
  component: Grasshopper.Component
}

const AboutMenu = ({ component }: AboutMenuProps): React.ReactElement => {
  const { library } = useGraphManager()

  const { name, nickname, description } = component

  const { onCancel } = useGenericMenuManager()

  const icon = library?.find((template) => template.guid === component.guid)?.icon ?? ''

  useDebugRender('About Menu')

  return (
    <div className="w-full flex flex-col">
      <div className="w-full h-12 flex justify-start items-center">
        <img
          width="24px"
          height="24px"
          className="mr-2"
          draggable="false"
          src={`data:image/png;base64,${icon}`}
          alt={component.name}
        />
        <h3 className="text-lg mb-1">{`${name} (${nickname})`}</h3>
      </div>
      <p className="whitespace-normal ml-8 mb-8">{description}</p>
      <div className="ml-8 w-full h-8 flex justify-start items-center">
        <button
          className="flex items-center justify-start rounded-full p-2 h-8 border-2 border-swampgreen"
          onClick={onCancel}
        >
          <svg width={12} height={12} viewBox="0 0 10 10">
            <line
              x1={1}
              y1={1}
              x2={9}
              y2={9}
              fill="none"
              stroke="#7BBFA5"
              strokeWidth="2px"
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1={1}
              y1={9}
              x2={9}
              y2={1}
              fill="none"
              stroke="#7BBFA5"
              strokeWidth="2px"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default React.memo(AboutMenu)
