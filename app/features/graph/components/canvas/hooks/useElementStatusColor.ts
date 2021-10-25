import { useState, useEffect } from 'react'
import { useSolutionMessages, useSolutionPhase } from '@/features/graph/store/solution/hooks'

export const useElementStatusColor = (elementId: string): string => {
  const messages = useSolutionMessages()
  const phase = useSolutionPhase()

  const [statusColor, setStatusColor] = useState('#FFFFFF')

  useEffect(() => {
    if (phase !== 'idle') {
      return
    }

    const getColorFromMessageLevel = (level?: string): string => {
      switch (level) {
        case 'error':
          return '#FF7171'
        case 'warning':
          return '#FFBE71'
        default:
          return '#FFFFFF'
      }
    }

    const message = messages[elementId]?.[0]

    setStatusColor(getColorFromMessageLevel(message?.level))
  }, [phase])

  return statusColor
}
