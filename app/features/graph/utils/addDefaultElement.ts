import { Grasshopper, NodePen } from 'glib'
import { useGraphDispatch } from '../store/graph/hooks'

/**
 * Given a grasshopper component template from the generated library, add a default elements of that type.
 * @remarks Useful for handling specially-handled elements like the number slider
 */
export const addDefaultElement = (
  addElement: ReturnType<typeof useGraphDispatch>['addElement'],
  position: [x: number, y: number],
  template: Grasshopper.Component,
  data?: Partial<NodePen.Element<'static-component' | 'number-slider'>['current']>
): void => {
  const { category, guid } = template
  const [x, y] = position

  switch (category.toLowerCase()) {
    case 'params': {
      switch (guid) {
        case '57da07bd-ecab-415d-9d86-af36d7073abc': {
          addElement({
            type: 'number-slider',
            position: [x, y],
            template: {
              ...template,
              type: 'number-slider',
            },
            data,
          })
          break
        }
        case '59e0b89a-e487-49f8-bab8-b5bab16be14c': {
          addElement({
            type: 'panel',
            position: [x, y],
            template: {
              ...template,
              type: 'panel',
            },
            data,
          })
          break
        }
        default: {
          break
        }
      }
      break
    }
    default: {
      addElement({
        type: 'static-component',
        template: { type: 'static-component', ...template },
        position: [x, y],
      })
      break
    }
  }
}
