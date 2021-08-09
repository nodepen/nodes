import { newGuid } from 'features/graph/utils'
import { NodePen } from 'glib'
import { ComponentShortcut } from '../types'

export const shortcuts: ComponentShortcut[] = [
  {
    test: (value: string): boolean => {
      return value[0] === '"' || value[0] === '“' || value[0] === '”'
    },
    pattern: '"∙∙∙',
    description: 'Create a text panel with the provided content. Any double quotes will be ignored.',
    template: '59e0b89a-e487-49f8-bab8-b5bab16be14c',
    onCreate: (value: string): NodePen.Element<'panel'> => {
      const content = value.replaceAll('"', '')

      return {
        id: newGuid(),
        template: {
          type: 'panel',
        },
        current: {
          position: [0, 0],
          dimensions: {
            width: 0,
            height: 0,
          },
          anchors: {},
        },
      }
    },
  },
  {
    test: (value: string): boolean => {
      return value[0] === '/' && value[1] === '/'
    },
    pattern: '//∙∙∙',
    description: 'Text Panel with provided content',
    template: '59e0b89a-e487-49f8-bab8-b5bab16be14c',
    onCreate: (value: string): NodePen.Element<'panel'> => {
      const content = value.replace('//', '')

      return {
        id: newGuid(),
        template: {
          type: 'panel',
        },
        current: {
          position: [0, 0],
          dimensions: {
            width: 0,
            height: 0,
          },
          anchors: {},
        },
      }
    },
  },
]
