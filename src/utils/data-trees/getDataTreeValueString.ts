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
        case 'text': {
            return value.value
        }
        case 'number':
        case 'integer': {
            return value.value
        }
        case 'boolean': {
            return value.value
        }
        default: {
            return `${value.value}`
        }
    }
}