import React from 'react'

// TODO: Allow views to register their own icon
export const getViewIcon = (viewKey: string, color: string) => {
  switch (viewKey) {
    case 'document': {
      return (
        <svg
          width={20}
          aria-hidden="true"
          fill="none"
          stroke={color}
          strokeWidth={2}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )
    }
    case 'model':
    case 'speckle-viewer': {
      return (
        <svg
          width={20}
          aria-hidden="true"
          fill="none"
          stroke={color}
          strokeWidth={2}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )
    }
    default: {
      return <></>
    }
  }
}
