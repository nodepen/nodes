import { newGuid } from 'features/graph/utils'
import { NodePen } from 'glib'
import { ComponentShortcut } from '../types'

export const shortcuts: ComponentShortcut[] = [
  {
    test: (value: string): boolean => {
      return value[0] === '"' || value[0] === '“' || value[0] === '”'
    },
    pattern: '"∙∙∙',
    description: 'Text Panel with provided content (without quotes)',
    template: 'put-id-here',
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
    template: 'put-id-here',
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
