import { newGuid } from 'features/graph/utils'
import { NodePen } from 'glib'
import { ComponentShortcut } from '../types'

export const shortcuts: ComponentShortcut[] = [
  {
    test: (value: string): boolean => {
      return value[0] === '"' || value[0] === '“' || value[0] === '”'
    },
    pattern: '"∙∙∙',
    description: (
      <div className="w-full flex flex-col">
        <p>Text Panel with provided content. All double quotes will be ignored.</p>
        <h4>Examples</h4>
        <div className="w-full flex items-center">
          <pre>&quot;42&quot;</pre>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <pre>42</pre>
        </div>
        <div className="w-full flex items-center">
          <pre>&quot;5&apos;9&quot; tall&quot;</pre>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <pre>5'9 tall</pre>
        </div>
      </div>
    ),
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
    description: <p>Text Panel with provided content</p>,
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
