import { useGraphManifest } from '@/features/graph/store/graph/hooks'
import Link from 'next/link'
import React from 'react'
import { useSessionManager } from '../../context/session'

export const HeaderTitle = (): React.ReactElement => {
  const { device } = useSessionManager()

  const { name, author } = useGraphManifest()

  return (
    <div className="h-full flex flex-grow items-center justify-start">
      <button className="h-6 pl-2 pr-1 mr-2 flex items-center justify-start rounded-sm hover:bg-green">
        <p className="leading-4 text-sm text-dark font-semibold">{name}</p>
        <svg className="w-4 h-4" fill="#333" viewBox="0 -2 20 20" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div className="h-6 mr-3 flex items-center justify-start">
        <svg className="w-5 h-5 mr-1" fill="none" stroke="#333" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <Link href={`/${author.name}`}>
          <a className="leading-4 text-xs font-semibold hover:underline">{author.name}</a>
        </Link>
      </div>
      <div className="h-6 flex items-center justify-start">
        <svg className="w-5 h-5 mr-1" fill="none" stroke="#333" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        <p className="leading-4 text-xs font-semibold select-none">1.2k</p>
      </div>
    </div>
  )
}
