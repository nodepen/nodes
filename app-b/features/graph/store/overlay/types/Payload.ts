import { OverlayType } from './OverlayType'

export type ShowPayload = {
  type: OverlayType
} & {
  type: 'parameterMenu'
  sourceElementId: string
  sourceParameterId: string
}
