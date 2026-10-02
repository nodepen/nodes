import type { TooltipConfiguration } from './TooltipConfiguration'
import type { TooltipContext } from './TooltipContext'

export type Tooltip = {
  /** Settings shared by all tooltip instances. */
  configuration: TooltipConfiguration
  /** Settings specific to a given tooltip type. */
  context: TooltipContext
}
