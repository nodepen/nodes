import React from 'react'
import { NodePen } from 'glib'
import { useDebugRender } from 'hooks'
import { ElementContainer } from '../../common'
import { useGraphSelection } from '@/features/graph/store/graph/hooks'
import { StaticComponentParameter } from './lib'

type StaticComponentProps = {
  element: NodePen.Element<'static-component'>
}

const StaticComponent = ({ element }: StaticComponentProps): React.ReactElement => {
  const { template, id } = element

  useDebugRender(`StaticComponent | ${template.name} | ${id}`)

  const selection = useGraphSelection()

  const isSelected = selection.includes(id)

  return (
    <>
      <ElementContainer element={element}>
        <div className="flex flex-col items-stretch pointer-events-auto">
          <div
            className={`${
              isSelected ? 'bg-green' : 'bg-white'
            } h-2 border-2 border-b-0 border-dark rounded-md rounded-bl-none rounded-br-none transition-colors duration-150`}
          />
          <div
            className={`${
              isSelected ? 'bg-green' : 'bg-white'
            } flex flex-row justify-center items-stretch transition-colors duration-150`}
          >
            <div className="flex-grow flex flex-col items-stretch">
              {Object.entries(element.current.inputs).map(([id, i]) => {
                const parameter = element.template.inputs[i]

                return (
                  <StaticComponentParameter
                    key={`input-param-${id}`}
                    mode={'input'}
                    template={{ id, ...parameter }}
                    parent={element}
                  />
                )
              })}
            </div>
            <div
              id="label-column"
              className={`w-10 ml-1 mr-1 p-2 pt-4 pb-4 rounded-md bg-white border-2 border-dark flex flex-col justify-center items-center transition-colors duration-150`}
            >
              <div
                className="font-panel text-v font-bold text-sm select-none"
                style={{ writingMode: 'vertical-lr', textOrientation: 'sideways', transform: 'rotate(180deg)' }}
              >
                {template.nickname.toUpperCase()}
              </div>
            </div>
            <div className="flex-grow flex flex-col items-stretch">
              {Object.entries(element.current.outputs).map(([id, i]) => {
                const parameter = element.template.outputs[i]

                return (
                  <StaticComponentParameter
                    key={`output-param-${id}`}
                    mode={'output'}
                    template={{ id, ...parameter }}
                    parent={element}
                  />
                )
              })}
            </div>
          </div>
          <div
            className={`${
              isSelected ? 'bg-green' : 'bg-white'
            } h-2 border-2 border-t-0 border-dark rounded-md rounded-tl-none rounded-tr-none shadow-osm transition-colors duration-150`}
          />
        </div>
      </ElementContainer>
    </>
  )
}

export default React.memo(StaticComponent)
