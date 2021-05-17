import { DataTreeValue } from '../nodepen/solution/tree'
import { SolutionValueType } from '../nodepen/solution/value'

export const isNumberValue = (value: DataTreeValue<SolutionValueType>): value is DataTreeValue<'number'> => {
    return value.type === 'number'
}

export const isStringValue = (value: DataTreeValue<SolutionValueType>): value is DataTreeValue<'string'> => {
    return value.type === 'string'
}