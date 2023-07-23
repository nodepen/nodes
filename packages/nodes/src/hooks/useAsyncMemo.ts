import { useEffect, useRef, useState } from 'react'

type AsyncMemoResult<T> =
  | {
      isLoading: true
      value: null
    }
  | {
      isLoading: false
      value: T
    }

export const useAsyncMemo = <T>(key: string, asyncFactory: () => Promise<T>): AsyncMemoResult<T> => {
  const internalKey = useRef<string>()

  const [internalValue, setInternalValue] = useState<AsyncMemoResult<T>>({ isLoading: true, value: null })

  useEffect(() => {
    if (internalKey.current === key) {
      // We have already fetched this value
      return
    }

    internalKey.current = key
    setInternalValue({ isLoading: true, value: null })

    const requestKey = key

    asyncFactory()
      .then((result) => {
        if (requestKey !== internalKey.current) {
          // Value was invalidated during request. Discard results.
          return
        }

        setInternalValue({ isLoading: false, value: result })
      })
      .catch((e) => {
        // TODO: Emit errors
        console.log(`🐍 Error during useAsyncMemo invocation for key [${key}]`)
        console.error(e)
      })
  }, [key])

  return internalValue
}
