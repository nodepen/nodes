import React from 'react'
import { NodePen } from 'glib'
import { CurveParameter, GeometryParameter, LineParameter, PointParameter } from '../parameters'

type StaticComponentProps = {
  element: NodePen.Element<'static-component'>
}

const StaticComponent = ({ element }: StaticComponentProps): React.ReactElement => {
  const parameterIds = [...Object.keys(element.current.inputs), ...Object.keys(element.current.outputs)]
  const parameters = [
    ...Object.keys(element.current.inputs).map((id) => element.template.inputs[element.current.inputs[id]]),
    ...Object.keys(element.current.outputs).map((id) => element.template.outputs[element.current.outputs[id]]),
  ]

  return (
    <>
      {parameterIds.map((id, i) => {
        const parameter = parameters[i]

        switch (parameter.type.toLowerCase()) {
          case 'boolean':
          case 'domain':
          case 'integer':
          case 'number':
          case 'text':
          case 'transform':
          case 'vector': {
            return null
          }
          case 'curve': {
            return <CurveParameter element={element} parameter={parameter} parameterId={id} />
          }
          case 'geometry': {
            return <GeometryParameter element={element} parameter={parameter} parameterId={id} />
          }
          case 'line': {
            return <LineParameter element={element} parameter={parameter} parameterId={id} />
          }
          case 'point': {
            return <PointParameter element={element} parameter={parameter} parameterId={id} />
          }
          default: {
            console.log(`🐍 Could not convert potentially visible geometry of type '${parameter.type.toLowerCase()}'`)
            return null
          }
        }
      })}
    </>
  )
}

export default React.memo(StaticComponent)
