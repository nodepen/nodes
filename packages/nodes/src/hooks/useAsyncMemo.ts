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

// TODO: Cache key values in a synchronously-findable way. In the current implementation, even if the value is available,
// we still flash a loading state briefly while its found in the asyncFactory invocation.

export const useAsyncMemo = <T>(key: string, asyncFactory: () => Promise<T>): AsyncMemoResult<T> => {
  const internalKey = useRef<string>()

  const [internalValue, setInternalValue] = useState<AsyncMemoResult<T>>({ isLoading: true, value: null })

  useEffect(() => {
    console.log('Fetching...')

    if (internalKey.current === key) {
      // We have already fetched this value
      console.log('Value already available.')
      return
    }

    internalKey.current = key
    setInternalValue({ isLoading: true, value: null })

    const requestKey = key

    asyncFactory()
      .then((result) => {
        if (requestKey !== internalKey.current) {
          // Value was invalidated during request. Discard results.
          console.log('Value outdated.')
          return
        }

        console.log('Updated value.')
        console.log(result)

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
