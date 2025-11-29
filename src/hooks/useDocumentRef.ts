import { useRef } from 'react'

export const useDocumentRef = (): React.MutableRefObject<HTMLDivElement> => {
  return useRef(document as unknown as HTMLDivElement)
}
