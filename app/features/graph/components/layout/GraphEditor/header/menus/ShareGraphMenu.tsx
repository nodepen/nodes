import { Typography } from '@/features/common'
import { useRouter } from 'next/router'
import React, { useEffect, useRef } from 'react'

export const ShareGraphMenu = (): React.ReactElement => {
  const router = useRouter()

  const inputRef = useRef<HTMLInputElement>(null)

  const currentUrl = `${window.location.host}${router.asPath}`

  const handleClipboard = (): void => {
    navigator.clipboard.writeText(currentUrl).catch((err) => {
      if (process?.env?.NEXT_PUBLIC_DEBUG === 'true') {
        console.log(err)
      }
    })
  }

  useEffect(() => {
    handleClipboard()
  }, [])

  return (
    <div className="p-2 rounded-md bg-green">
      <div className="p-1 pb-0">
        <Typography.Label size="md" color="darkgreen">
          Share with link
        </Typography.Label>
      </div>
      <div className="w-full p-1 mb-2 flex items-center">
        <svg
          className="w-5 h-5 mr-1"
          fill="none"
          stroke="#093824"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
        <Typography.Label size="sm" color="darkgreen">
          Public
        </Typography.Label>
      </div>
      <div className="w-full h-10 flex items-center justify-start">
        <input
          className="w-48 h-10 pl-2 pr-2 mr-2 rounded-md bg-pale"
          ref={inputRef}
          value={currentUrl}
          readOnly={true}
          onKeyDown={(e) => e.stopPropagation()}
        />
        <button
          className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-swampgreen"
          onClick={handleClipboard}
        >
          <svg className="w-5 h-5" fill="none" stroke="#093824" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
