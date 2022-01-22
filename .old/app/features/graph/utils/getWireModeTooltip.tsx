import { WireMode } from '../store/graph/types'

export const getWireModeTooltip = (mode: WireMode | 'transpose'): JSX.Element => {
  switch (mode) {
    case 'default': {
      return (
        <img
          src="/icons/wire-tooltip-default.svg"
          alt="A curved arrow pointing right. This tooltip indicates a new connection can be started."
        />
      )
    }
    case 'add': {
      return (
        <img
          src="/icons/wire-tooltip-add.svg"
          alt="A curved arrow pointing right with an addition symbol above it. The arrowhead is colored green. This tooltip indicates a new connection can be started, and that any connections will merge with existing connections."
        />
      )
    }
    case 'remove': {
      return (
        <img
          src="/icons/wire-tooltip-remove.svg"
          alt="A curved arrow pointing right with a subtraction symbol above it. The arrowhead is colored red. This tooltip indicates a new connection can be started, and that any connections will remove any identical existing connections."
        />
      )
    }
    case 'transpose': {
      return (
        <img
          src="/icons/wire-tooltip-transpose.svg"
          alt="A curved arrow pointing right with a squiggle above it. This tooltip indicates that the user can begin moving existing connections at this location."
        />
      )
    }
  }
}
