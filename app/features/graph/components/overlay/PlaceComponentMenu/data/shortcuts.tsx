import { getDataTreePathString } from '@/features/graph/utils'
import { NodePen } from 'glib'
import { ComponentShortcut } from '../types'

export const shortcuts: ComponentShortcut[] = [
  {
    test: (value: string): boolean => {
      const crumbs = value.split('<')

      if (crumbs.length !== 2) {
        return false
      }

      if (!crumbs.every((crumb) => !isNaN(parseFloat(crumb)))) {
        return false
      }

      return true
    },
    template: '57da07bd-ecab-415d-9d86-af36d7073abc',
    pattern: '# < #',
    label: 'slider',
    description: 'Create a number slider set to the provided value. The first number will be used as the minimum.',
    onCreate: (value: string): Partial<NodePen.Element<'number-slider'>['current']> => {
      const crumbs = value.split('<')

      const [min, val] = crumbs

      const [, minDecimals] = min.split('.')
      const [valueNumber, valueDecimals] = val.split('.')

      const precision = Math.min(6, Math.max((minDecimals ?? ''.length, (valueDecimals ?? '').length))) as 0
      const path = getDataTreePathString([0])

      const data: Partial<NodePen.Element<'number-slider'>['current']> = {
        precision,
        domain: [parseFloat(min), Math.min(Math.pow(10, 7), Math.pow(10, valueNumber.length))],
        rounding: 'rational',
        values: {
          output: {
            [path]: [
              {
                type: 'number',
                value: Math.min(Math.pow(10, 7), parseFloat(val)),
              },
            ],
          },
        },
      }

      return data
    },
  },
  {
    test: (value: string): boolean => {
      return !isNaN(parseFloat(value))
    },
    template: '57da07bd-ecab-415d-9d86-af36d7073abc',
    pattern: '#',
    label: 'slider',
    description: 'Create a number slider set to the provided value.',
    onCreate: (value: string): Partial<NodePen.Element<'number-slider'>['current']> => {
      const [num, decimals] = value.split('.')

      const precision = Math.min(6, (decimals ?? '').length) as 0 | 1 | 2 | 3 | 4 | 5 | 6
      const path = getDataTreePathString([0])

      const data: Partial<NodePen.Element<'number-slider'>['current']> = {
        precision,
        domain: [0, Math.min(Math.pow(10, 7), Math.pow(10, num.length))],
        rounding: 'rational',
        values: {
          output: {
            [path]: [
              {
                type: 'number',
                value: Math.min(Math.pow(10, 7), parseFloat(value)),
              },
            ],
          },
        },
      }

      return data
    },
  },
  {
    test: (value: string): boolean => {
      return value[0] === '"' || value[0] === '“' || value[0] === '”'
    },
    pattern: '"∙∙∙',
    description: 'Create a text panel with the provided content. Any double quotes will be ignored.',
    template: '59e0b89a-e487-49f8-bab8-b5bab16be14c',
    onCreate: (value: string): Partial<NodePen.Element<'panel'>['current']> => {
      const content = value.replaceAll('"', '').replaceAll('“', '').replaceAll('”', '').substring(0, 1024)
      const path = getDataTreePathString([0])

      const data: Partial<NodePen.Element<'panel'>['current']> = {
        dimensions: {
          width: 150,
          height: 80,
        },
        values: {
          output: {
            [path]: [
              {
                type: 'text',
                value: content,
              },
            ],
          },
        },
      }

      return data
    },
  },
  {
    test: (value: string): boolean => {
      return value[0] === '/' && value[1] === '/'
    },
    pattern: '//∙∙∙',
    description: 'Create a text panel with the provided content.',
    template: '59e0b89a-e487-49f8-bab8-b5bab16be14c',
    onCreate: (value: string): Partial<NodePen.Element<'panel'>['current']> => {
      const content = value.replace('//', '').substring(0, 1024)
      const path = getDataTreePathString([0])

      const data: Partial<NodePen.Element<'panel'>['current']> = {
        dimensions: {
          width: 150,
          height: 80,
        },
        values: {
          output: {
            [path]: [
              {
                type: 'text',
                value: content,
              },
            ],
          },
        },
      }

      return data
    },
  },
]
