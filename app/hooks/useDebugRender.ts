import { useEffect } from 'react'

export const useDebugRender = (message: string): void => {
  useEffect(() => {
    if (!(process?.env?.NEXT_PUBLIC_DEBUG === 'true')) {
      return
    }

    console.debug(`⚙⚙⚙ ${message}`)
  })
}
