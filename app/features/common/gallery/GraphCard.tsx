import React, { useState } from 'react'
import { NodePen } from 'glib'
import { GraphThumbnail } from './GraphThumbnail'
import Link from 'next/link'

type GraphCardProps = {
  graph: NodePen.GraphManifest
  orientation: 'vertical' | 'landscape'
}

export const GraphCard = ({ graph, orientation }: GraphCardProps): React.ReactElement => {
  const { id, name, author, files, stats } = graph

  const [hover, setHover] = useState(false)

  return (
    <Link href={`/${author.name}/gh/${id}`}>
      <a
        className={`bg-swampgreen w-12 h-12 rounded-md relative transition-transform duration-150 ease-out`}
        style={{
          width: '100%',
          paddingBottom: orientation === 'vertical' ? '133%' : '75%',
          transform: hover ? 'translateY(-3px) scale(102%)' : 'translateY(0px) scale(100%)',
        }}
        onPointerEnter={() => {
          setHover(true)
        }}
        onPointerLeave={() => {
          setHover(false)
        }}
      >
        <div className="w-full h-full absolute top-0 left-0">
          <div className="w-full h-full p-2 flex flex-col">
            <GraphThumbnail imageSrc={files.thumbnailImage} videoSrc={files.thumbnailVideo} hover={hover} />
            <div className="w-full pl-1 flex items-start overflow-hidden">
              <h4 className="mt-1 flex-grow text-darkgreen font-medium text-lg">{name}</h4>
              <button className="w-6 h-10 flex items-center justify-center" style={{ minWidth: 24 }}>
                <svg className="w-6 h-6" fill="#093824" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
            <div className="w-full flex-grow pl-1 flex flex-col justify-end">
              <div className="w-full flex overflow-hidden items-center">
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
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="mr-2 text-xs text-darkgreen font-semibold">{author.name}</p>
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <p className="mr-3 text-xs text-darkgreen font-semibold">{stats.views}</p>
              </div>
            </div>
          </div>
        </div>
      </a>
    </Link>
  )
}
