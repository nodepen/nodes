import React, { useContext } from 'react'
import { Glasshopper } from '@/../lib'
import { store } from '../state'

type GlasshopperComponentProps = {
  component: Glasshopper.Component
}

export const GlasshopperComponent = ({ component }: GlasshopperComponentProps): JSX.Element => {
  const { state } = useContext(store)

  const [tx, ty] = state.camera.position
  const [x, y] = component.position

  // return (
  //   <div
  //     className="absolute w-12 h-12 bg-darkgreen rounded-md z-10"
  //     style={{ transform: `translate(${x + tx}px, ${-y + ty}px)`, left: 0, top: 0 }}
  //   />
  // )

  return (
    <div
      className={`absolute border-solid border-dark border-2 shadow-osm rounded-md ${
        component.selected ? 'bg-swampgreen' : 'bg-light'
      } flex z-10 overflow-hidden select-none`}
      style={{ transform: `translate(${x + tx}px, ${-y + ty}px)`, left: 0, top: 0 }}
    >
      <div className="p-2 flex flex-col items-center justify-evenly">
        {component.component.Inputs.map((input, i) => (
          <div
            key={`input-${input.Name}`}
            className={`pip-left text-sm mt-1 mb-1 w-12 whitespace-no-wrap z-10 ${
              i < component.component.Inputs.length - 1 ? 'border-b-2 border-dark pb-2' : ''
            }`}
          >
            <div className="pip mr-1 z-0 w-3 h-3 bg-light border-solid border-dark border-2 rounded-sm inline-block hover:bg-gray-500 hover:cursor-pointer shadow-ism" />
            <div className="inline-block">{input.NickName}</div>
          </div>
        ))}
      </div>
      <div className="m-2 ml-0 mr-0 w-8 overflow-hidden flex flex-col items-center justify-center rounded-md border-solid border-dark border-2 shadow-ism bg-white z-10">
        <span className="font-bold" style={{ transform: 'rotate(-90deg)' }}>
          {component.component.NickName}
        </span>
      </div>
      <div className="p-2 flex flex-col items-center justify-evenly">
        {component.component.Outputs.map((output, i) => (
          <div
            key={`output-${output.Name}`}
            className={`pip-right text-right text-sm mt-1 mb-1 w-8 whitespace-no-wrap z-10 ${
              i < component.component.Outputs.length - 1 ? 'border-b-2 border-dark pb-2' : ''
            }`}
          >
            <div className="inline-block">{output.NickName}</div>
            <div className="pip ml-1 z-0 w-3 h-3 bg-light border-solid border-dark border-2 rounded-sm inline-block hover:bg-gray-500 hover:cursor-pointer shadow-ism" />
          </div>
        ))}
      </div>
      <style jsx>{`
        .pip-left > * {
          transform: translateX(-12px);
        }

        .pip-right > * {
          transform: translateX(12px);
        }
      `}</style>
    </div>
    //   <div
    //     className="selection-test"
    //     :style="{
    //       opacity: component.selected ? 1 : 0,
    //       transform: `translate(${tf[0]}px, ${tf[1]}px)`,
    //       'clip-path': `circle(${
    //         component.selected ? `${r}px` : '0px'
    //       } at center)`,
    //       transition: 'clip-path',
    //       'transition-duration': '300ms',
    //       'transition-timing-function': 'ease'
    //     }"
    //   />
    // </div>
  )
}
