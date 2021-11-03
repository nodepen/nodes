import * as GH from './types'

export type SolutionValue = {
    'boolean': GH.Boolean,
    'curve': GH.Curve,
    'circle': GH.Circle,
    'domain': GH.Domain,
    'integer': GH.Integer,
    'line': GH.Line,
    'number': GH.Number,
    'path': never,
    'plane': GH.Plane,
    'point': GH.Point,
    'rectangle': GH.Rectangle,
    'text': GH.Text,
    'transform': GH.Transform,
    'vector': GH.Vector,
}