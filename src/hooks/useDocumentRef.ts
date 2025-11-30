import { useLayoutEffect, useRef } from 'react'

export const useDocumentRef = (): React.MutableRefObject<HTMLDivElement> => {
  const doc = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    doc.current = window.document as unknown as HTMLDivElement
  }, [])

  return doc as React.MutableRefObject<HTMLDivElement>
}
