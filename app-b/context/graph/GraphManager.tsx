import React, { useEffect, useState } from 'react'
import { Grasshopper } from 'glib'
import { GraphStore } from './types'
import { useSessionManager } from '../session'
import { useApolloClient, gql } from '@apollo/client'

export const GraphContext = React.createContext<GraphStore>({})

type GraphManagerProps = {
  children?: JSX.Element
}

export const GraphManager = ({ children }: GraphManagerProps): React.ReactElement => {
  const { token } = useSessionManager()

  const client = useApolloClient()

  const [library, setLibrary] = useState<Grasshopper.Component[]>()

  useEffect(() => {
    console.log('smt')
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

      console.log(data)

      return data?.getInstalledComponents
    }

    fetchLibrary()
      .then((lib) => {
        console.log({ lib })
        setLibrary(lib)
      })
      .catch((err) => {
        console.log(document.cookie)
        console.error(err)
      })
  }, [token, library, client])

  const store: GraphStore = {
    library,
  }

  return <GraphContext.Provider value={store}>{children}</GraphContext.Provider>
}
