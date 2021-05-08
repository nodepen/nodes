type SelectionMode = 'replace' | 'add' | 'remove'

export const selectionMode = (keys: string[]): SelectionMode => {
  if (keys.length !== 1) {
    return 'replace'
  }

  const key = keys[0]

  switch (key) {
    case 'ControlLeft': {
      return 'remove'
    }
    case 'ShiftLeft': {
      return 'add'
    }
    default: {
      return 'replace'
    }
  }
}
