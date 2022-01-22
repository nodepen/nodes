import React, { useState, useEffect } from 'react'
import { assert } from 'glib'
import rhino3dm, { RhinoModule } from 'rhino3dm'
import { useGraphElements } from '../../store/graph/hooks'
import { StaticComponent } from './components/elements'

export const RhinoContext = React.createContext<{ module?: RhinoModule }>({})

const SceneElements = (): React.ReactElement => {
  const graph = useGraphElements()
  const elements = Object.values(graph)

  const [rhino, setRhino] = useState<RhinoModule>()

  useEffect(() => {
    rhino3dm().then((r) => {
      setRhino(r)
    })
  }, [])

  return (
    <RhinoContext.Provider value={{ module: rhino }}>
      {elements.map((element) => {
        switch (element.template.type) {
          case 'static-component': {
            if (!assert.element.isStaticComponent(element)) {
              return null
            }

            return <StaticComponent key={`scene-element-static-component-${element.id}`} element={element} />
          }
          default: {
            return null
          }
        }
      })}
    </RhinoContext.Provider>
  )
}

export default React.memo(SceneElements)
