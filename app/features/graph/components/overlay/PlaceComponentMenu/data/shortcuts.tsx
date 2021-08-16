import { newGuid } from 'features/graph/utils'
import { NodePen } from 'glib'
import { ComponentShortcut } from '../types'

export const shortcuts: ComponentShortcut[] = [
  {
    test: (value: string): boolean => {
      return !isNaN(parseFloat(value))
    },
    template: '57da07bd-ecab-415d-9d86-af36d7073abc',
    pattern: '#',
    description: 'Create a number slider set to the provided value.',
    onCreate: (value: string): Partial<NodePen.Element<'number-slider'>['current']> => {
      const [num, decimals] = value.split('.')

      const precision = Math.min(6, (decimals ?? '').length) as 0 | 1 | 2 | 3 | 4 | 5 | 6

      const data: Partial<NodePen.Element<'number-slider'>['current']> = {
        precision,
        domain: [0, Math.pow(10, num.length)],
        rounding: 'rational',
        values: {
          output: {
            '{0;}': [
              {
                type: 'number',
                data: parseFloat(value),
              },
            ],
          },
        },
      }

      return data
    },
  },
  // {
  //   test: (value: string): boolean => {
  //     return value[0] === '"' || value[0] === '“' || value[0] === '”'
  //   },
  //   pattern: '"∙∙∙',
  //   description: 'Create a text panel with the provided content. Any double quotes will be ignored.',
  //   template: '59e0b89a-e487-49f8-bab8-b5bab16be14c',
  //   onCreate: (value: string): NodePen.Element<'panel'> => {
  //     const content = value.replaceAll('"', '')

  //     return {
  //       id: newGuid(),
  //       template: {
  //         type: 'panel',
  //       },
  //       current: {
  //         position: [0, 0],
  //         dimensions: {
  //           width: 0,
  //           height: 0,
  //         },
  //         anchors: {},
  //       },
  //     }
  //   },
  // },
  // {
  //   test: (value: string): boolean => {
  //     return value[0] === '/' && value[1] === '/'
  //   },
  //   pattern: '//∙∙∙',
  //   description: 'Text Panel with provided content',
  //   template: '59e0b89a-e487-49f8-bab8-b5bab16be14c',
  //   onCreate: (value: string): NodePen.Element<'panel'> => {
  //     const content = value.replace('//', '')

  //     return {
  //       id: newGuid(),
  //       template: {
  //         type: 'panel',
  //       },
  //       current: {
  //         position: [0, 0],
  //         dimensions: {
  //           width: 0,
  //           height: 0,
  //         },
  //         anchors: {},
  //       },
  //     }
  //   },
  // },
]
