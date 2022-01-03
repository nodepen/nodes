import { useState, useEffect, useCallback } from 'react'

type DeviceContext = {
  breakpoint: 'sm' | 'md'
  iOS: boolean
  width: number
}

export const useDeviceConfiguration = (): DeviceContext => {
  const [iOS, setIOS] = useState(false)
  const [breakpoint, setBreakpoint] = useState<DeviceContext['breakpoint']>('sm')
  const [width, setWidth] = useState(1920)

  useEffect(() => {
    if (['iPhone', 'iPod', 'iPad'].includes(process.browser ? navigator.platform : '')) {
      setIOS(true)
    }
  }, [])

  const handleResize = useCallback((): void => {
    const size: DeviceContext['breakpoint'] = window.innerWidth < 750 ? 'sm' : 'md'

    if (breakpoint !== size) {
      setBreakpoint(size)
    }

    setWidth(window.innerWidth)
  }, [breakpoint])

  useEffect(() => {
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })

  useEffect(() => {
    // Determine device size once
    handleResize()
  }, [])

  return { iOS, breakpoint, width }
}
