import type * as NodePen from '@/types'

export const getDataTreeValueString = (value?: NodePen.DataTreeValue): string => {
    if (value?.type === 'reference') {
        return value.description
    }

    if (!value?.value) {
        return ''
    }

    switch (value.type) {
        case 'string':
        case 'text':
        case 'number':
        case 'integer':
        case 'boolean': {
            return value.value
        }
        default: {
            return `${value.value}`
        }
    }
}