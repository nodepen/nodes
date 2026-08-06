import type * as NodePen from '@/types'
import { createSingleValue } from './createSingleValue'

const isValueValid = (value: string, valueType: NodePen.DataTreeValueType): boolean => {
    switch (valueType) {
        case 'text':
        case 'string': {
            return true
        }
        case 'boolean': {
            return ['true', 'false'].includes(value)
        }
        case 'number': {
            return /^[+-]?\d+(\.\d+)?$/.test(value)
        }
        case 'integer': {
            return /^[+-]?\d+$/.test(value)
        }
        default: {
            return false
        }
    }
}

/**
 * Given a raw string and the value type it should become, attempt to create a single-value data tree.
 * Returns `undefined` if `value` does not parse as a valid `valueType`.
 */
export const tryCreateSingleValue = (value: string, valueType: NodePen.DataTreeValueType): NodePen.DataTree | undefined => {
    if (!isValueValid(value, valueType)) {
        return undefined
    }

    return createSingleValue(value, valueType)
}
