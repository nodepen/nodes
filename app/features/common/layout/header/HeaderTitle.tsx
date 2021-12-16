import { useGraphManifest } from '@/features/graph/store/graph/hooks'
import React from 'react'
import { useSessionManager } from '../../context/session'

export const HeaderTitle = (): React.ReactElement => {
  const { device } = useSessionManager()

  const { name, author } = useGraphManifest()

  return (
    <div className="h-full flex flex-grow items-center justify-start">
      <button className="p-1 pr-2 mr-2 flex items-center rounded-md hover:bg-green">
        <div className="w-5 h-5 rounded-md flex items-center justify-center">
          <svg className="w-4 h-4" fill="none" stroke="#333" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="leading-4 text-md font-semibold" style={{ transform: 'translateY(-1px)' }}>
          {name}
        </p>
      </button>
      <button className="p-1 pr-2 mr-2 flex items-center rounded-md hover:bg-green">
        <div className="w-5 h-5 rounded-md flex items-center justify-center">
          <svg className="w-4 h-4" fill="#333" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <p className="leading-4 text-md font-semibold" style={{ transform: 'translateY(-1px)' }}>
          {author.name}
        </p>
      </button>
      {/* <button className="p-1 pr-2 flex items-center rounded-md hover:bg-green">
        <svg width="32" height="20" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4 3H21.0751C21.3685 3 21.6471 3.12882 21.8371 3.35235L28.6371 11.3524C28.9545 11.7258 28.9545 12.2742 28.6371 12.6476L21.8371 20.6476C21.6471 20.8712 21.3685 21 21.0751 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3Z"
            stroke="#333333"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            fill="#FFF"
          />
        </svg>
        <h1 className="leading-4 text-md font-semibold" style={{ transform: 'translateY(-1px)' }}>
          {name}
        </h1>
      </button>
      <div className="p-1 pr-2 mr-2 flex items-center rounded-md">
        <svg width="32" height="20" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4 3H21.0751C21.3685 3 21.6471 3.12882 21.8371 3.35235L28.6371 11.3524C28.9545 11.7258 28.9545 12.2742 28.6371 12.6476L21.8371 20.6476C21.6471 20.8712 21.3685 21 21.0751 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3Z"
            stroke="#333333"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            fill="#FFF"
          />
        </svg>
        <h1 className="leading-4 text-md font-semibold" style={{ transform: 'translateY(-1px)' }}>
          {author.name}
        </h1>
      </div> */}
    </div>
  )
}
