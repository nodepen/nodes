import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { useGraphManifest } from '@/features/graph/store/graph/hooks'
import { useSessionManager } from 'features/common/context/session'
import { Popover } from '@/features/common/popover'
import { ModalLayout } from '@/features/common/layout/ModalLayout'
import { EditGraphMenu } from './menus'

export const HeaderTitle = (): React.ReactElement => {
  const { device } = useSessionManager()

  const { name, author, stats, id } = useGraphManifest()

  const [showEditMenu, setShowEditMenu] = useState(false)
  const editButtonRef = useRef<HTMLButtonElement>(null)
  const editButtonPosition = useRef<[number, number]>([0, 0])

  return (
    <div className="h-full flex flex-grow items-center justify-start">
      <button
        ref={editButtonRef}
        className="h-6 pl-2 pr-1 mr-2 flex items-center justify-start rounded-sm hover:bg-green"
        onClick={() => {
          if (!editButtonRef.current) {
            return
          }

          const { left, top, height } = editButtonRef.current.getBoundingClientRect()

          editButtonPosition.current = [left, top + height + 8]
          setShowEditMenu(true)
        }}
      >
        <p className="leading-4 text-sm text-dark font-semibold">{name}</p>
        <svg className="w-4 h-4" fill="#333" viewBox="0 -2 20 20" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {showEditMenu ? (
        device.breakpoint === 'sm' ? (
          <ModalLayout onClose={() => setShowEditMenu(false)}>
            <EditGraphMenu graphId={id} initialValue={name} onClose={() => setShowEditMenu(false)} />
          </ModalLayout>
        ) : (
          <Popover position={editButtonPosition.current} anchor="TL">
            <EditGraphMenu graphId={id} initialValue={name} onClose={() => setShowEditMenu(false)} />
          </Popover>
        )
      ) : null}
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
        <p title={`${stats.views} views`} className="leading-4 text-xs font-semibold select-none">
          {stats.views}
        </p>
      </div>
    </div>
  )
}
