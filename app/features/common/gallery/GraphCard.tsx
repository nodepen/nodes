import React, { useRef, useState } from 'react'
import { NodePen } from 'glib'
import { GraphThumbnail } from './GraphThumbnail'
import Link from 'next/link'
import { Popover } from '../popover'
import { Modal } from '../layout'
import * as Typography from '../typography'

type GraphCardProps = {
  graph: NodePen.GraphManifest
  orientation: 'vertical' | 'horizontal'
  color: 'green' | 'swampgreen' | 'white'
  actionable?: boolean
  views?: boolean
  onDelete?: () => void | Promise<void>
}

export const GraphCard = ({
  graph,
  orientation,
  color,
  actionable = false,
  views = true,
  onDelete,
}: GraphCardProps): React.ReactElement => {
  const { id, name, author, files, stats } = graph

  const [hover, setHover] = useState(false)

  const [showPopover, setShowPopover] = useState(false)
  const popoverPosition = useRef<[number, number]>([0, 0])
  const buttonRef = useRef<HTMLButtonElement>(null)

  const [showModal, setShowModal] = useState(false)

  const backgroundColors: { [key in typeof color]: string } = {
    green: 'bg-green',
    swampgreen: 'bg-swampgreen',
    white: 'bg-white',
  }

  const textColors: { [key in typeof color]: string } = {
    green: 'text-darkgreen',
    swampgreen: 'text-darkgreen',
    white: 'text-dark',
  }

  const graphicColors: { [key in typeof color]: string } = {
    green: '#093824',
    swampgreen: '#093824',
    white: '#333333',
  }

  return (
    <div
      className={`${backgroundColors[color]} ${
        color === 'white' ? 'border-2 border-dark shadow-osm' : ''
      } w-12 h-12 rounded-md relative transition-transform duration-150 ease-out`}
      style={{
        width: '100%',
        paddingBottom: orientation === 'vertical' ? '133%' : '50%',
        transform: hover ? 'translateY(-3px)' : 'translateY(0px)',
      }}
      onPointerEnter={() => {
        setHover(true)
      }}
      onPointerLeave={() => {
        setHover(false)
      }}
    >
      <div className="w-full h-full absolute top-0 left-0">
        <div className={`${orientation === 'vertical' ? 'flex-col' : 'flex-row'} w-full h-full p-2 flex`}>
          <div style={{ minWidth: orientation === 'vertical' ? '100%' : 'calc(66% - 12px)' }}>
            <GraphThumbnail imageSrc={files.thumbnailImage} videoSrc={files.thumbnailVideo} hover={hover} />
          </div>
          <div
            className={`${
              orientation === 'vertical' ? 'w-full flex-grow flex flex-col' : 'flex-grow flex flex-col pl-1 pr-1'
            }`}
          >
            <div className="w-full pl-1 flex items-start overflow-hidden">
              <Link href={`/${author.name}/gh/${id}`}>
                <a
                  className={`${textColors[color]} ${
                    orientation === 'vertical' ? 'mt-1 text-lg leading-6' : 'text-md'
                  } flex-grow font-medium hover:underline overflow-hidden`}
                  style={{ maxHeight: 55, transform: orientation === 'vertical' ? 'translateY(2px)' : '' }}
                >
                  {name}
                </a>
              </Link>
              {actionable ? (
                <button
                  className="w-6 h-10 flex items-center justify-center"
                  ref={buttonRef}
                  style={{ minWidth: 24 }}
                  onClick={(e) => {
                    e.stopPropagation()

                    if (buttonRef.current) {
                      const { left, top, width, height } = buttonRef.current.getBoundingClientRect()
                      popoverPosition.current = [left + width, top + height + 6]
                    }

                    setShowPopover(true)
                  }}
                >
                  <svg
                    className="w-6 h-6"
                    fill={graphicColors[color]}
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              ) : null}
            </div>
            <div className="w-full flex-grow pl-1 flex flex-col justify-end">
              <div
                className={`${
                  orientation === 'vertical' ? 'items-center' : 'flex-col items-start'
                } w-full flex overflow-hidden`}
              >
                <div className={`${orientation === 'vertical' ? '' : 'mb-1'} flex items-center`}>
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke={graphicColors[color]}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <Link href={`/${author.name}`}>
                    <a className={`${textColors[color]} mr-2 text-xs font-semibold hover:underline`}>{author.name}</a>
                  </Link>
                </div>
                {views ? (
                  <div className={`${orientation === 'vertical' ? '' : 'mb-1'} flex items-center`}>
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke={graphicColors[color]}
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <p className={`${textColors[color]} mr-3 text-xs font-semibold select-none`}>{stats.views}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showPopover ? (
        <Popover
          anchor="TR"
          position={popoverPosition.current}
          onClose={() => {
            setShowPopover(false)
            setHover(false)
          }}
        >
          <div className="p-2 rounded-md bg-green flex flex-col">
            <button
              className="hover:bg-swampgreen p-1 pl-2 pr-2 flex items-center rounded-md text-darkgreen font-medium text-lg"
              onClick={() => {
                setShowPopover(false)
                setShowModal(true)
                setHover(false)
              }}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </button>
          </div>
        </Popover>
      ) : null}
      {showModal ? (
        <Modal
          onClose={() => {
            setShowModal(false)
            setHover(false)
          }}
        >
          <div className="w-full flex flex-col items-center">
            <div className="flex flex-col items-center" style={{ maxWidth: 350 }}>
              <Typography.Label size="md" color="dark">
                {`Are you sure you want to delete ${name}?`}
              </Typography.Label>
              <div className="buttons-container mt-2">
                <button
                  className="w-full h-8 pl-2 pr-2 flex items-center justify-center rounded-md hover:bg-green"
                  onClick={() => {
                    onDelete?.()
                    setShowModal(false)
                    setHover(false)
                  }}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="#333"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <div className="w-min pointer-events-none">
                    <Typography.Label size="sm" color="dark">
                      Delete
                    </Typography.Label>
                  </div>
                </button>
                <button
                  className="w-full h-8 pl-2 pr-2 flex items-center justify-center rounded-md hover:bg-green"
                  onClick={() => {
                    setShowModal(false)
                    setHover(false)
                  }}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="#333"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="w-min pointer-events-none">
                    <Typography.Label size="sm" color="dark">
                      Cancel
                    </Typography.Label>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}