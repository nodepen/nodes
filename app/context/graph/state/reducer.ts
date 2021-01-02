import { Glasshopper } from 'glib'
import { GraphAction, GraphStore } from './../types'
import { newGuid } from '@/utils'

export const reducer = (state: GraphStore, action: GraphAction): GraphStore => {
  switch (action.type) {
    case 'demo': {
      return state
    }
    case 'io/register-socket': {
      const { socket, id } = action

      console.debug(`Registered socket connection ${id}.`)

      socket.on('join-session-handshake', (message: string) => {
        console.debug(message)
      })

      socket.emit('join-session', id)

      state.socket = {
        io: socket,
        id
      }

      return state
    }
    case 'lib/load-components': {
      const { components } = action

      components.forEach((component) => {
        const { category, subcategory } = component

        const libraryCategory = state.library[category.toLowerCase()]
        const librarySubcategory = subcategory.toLowerCase()

        if (!libraryCategory[librarySubcategory]) {
          libraryCategory[librarySubcategory] = []
        }

        libraryCategory[librarySubcategory].push(component)
      })

      state.ready = true

      return { ...state }
    }
    case 'graph/add-component': {
      const { position, component } = action
      const guid = newGuid()

      const element = new Glasshopper.Element.StaticComponent(guid, position, component)

      state.elements[element.id] = element

      state.socket.io.emit('update-graph', JSON.stringify(state.elements))

      return { ...state }
    }
  }
}