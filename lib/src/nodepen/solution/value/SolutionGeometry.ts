import { CommonObject } from './types/shared/CommonObject'

/**
 * The geometric data stored alongside {@link SolutionValue} for use by rhino3dm
 */
export type SolutionGeometry = {
    'boolean': never,
    'curve': CommonObject,
    'circle': CommonObject,
    'domain': never,
    'integer': never,
    'line': never,
    'number': never,
    'path': never,
    'plane': never,
    'point': never,
    'rectangle': never,
    'text': never,
    'transform': never,
    'vector': never,
}