import { useEffect, useState } from 'react'

export const useCriteria = (...params: (unknown | undefined)[]): boolean => {
  const [status, setStatus] = useState(false)

  useEffect(() => {
    const result = !params.some((param) => !param)
    setStatus(result)
  }, [params])

  return status
}
