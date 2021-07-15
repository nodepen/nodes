import React, { useCallback, useEffect, useState, useRef, createRef } from 'react'
import { Grasshopper } from 'glib'
import { GraphStore } from './types'
import { useSessionManager } from '../session'
import { useApolloClient, gql } from '@apollo/client'
import { SetTransform } from '@/features/graph/types'

export const GraphContext = React.createContext<GraphStore>({
  register: {
    setTransform: () => '',
  },
  registry: {
    canvasContainerRef: createRef(),
    layoutContainerRef: createRef(),
  },
})

type GraphManagerProps = {
  children?: JSX.Element
}

export const GraphManager = ({ children }: GraphManagerProps): React.ReactElement => {
  const { token } = useSessionManager()

  const client = useApolloClient()

  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const layoutContainerRef = useRef<HTMLDivElement>(null)

  const [library, setLibrary] = useState<Grasshopper.Component[]>()

  useEffect(() => {
    if (!token || !!library) {
      return
    }

    const fetchLibrary = async (): Promise<Grasshopper.Component[]> => {
      const { data, error } = await client.query({
        query: gql`
          query {
            getInstalledComponents {
              guid
              name
              nickname
              description
              icon
              libraryName
              category
              subcategory
              isObsolete
              isVariable
              inputs {
                name
                nickname
                description
                type
                isOptional
              }
              outputs {
                name
                nickname
                description
                type
                isOptional
              }
            }
          }
        `,
      })

      if (error) {
        console.error(error)
      }

      return data?.getInstalledComponents
    }

    fetchLibrary()
      .then((lib) => {
        setLibrary(lib)
      })
      .catch((err) => {
        console.log(document.cookie)
        console.error(err)
      })
  }, [token, library, client])

  const [setTransform, setSetTransform] = useState<SetTransform>()

  const handleSetTransform = useCallback((setTransform: SetTransform) => {
    setSetTransform(() => setTransform)
  }, [])

  const store: GraphStore = {
    library,
    registry: {
      setTransform,
      canvasContainerRef,
      layoutContainerRef,
    },
    register: {
      setTransform: handleSetTransform,
    },
  }

  return <GraphContext.Provider value={store}>{children}</GraphContext.Provider>
}
