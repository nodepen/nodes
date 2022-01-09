import React, { useEffect, useRef, useState } from 'react'
import { useSessionManager } from '../context/session'

type GraphThumbnailProps = {
  imageSrc?: string
  videoSrc?: string
  hover: boolean
}

export const GraphThumbnail = ({ imageSrc, videoSrc, hover }: GraphThumbnailProps): React.ReactElement => {
  const { device } = useSessionManager()

  const [showVideo, setShowVideo] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (hover) {
      if (videoRef.current) {
        videoRef.current.currentTime = 0
      }
      setShowVideo(true)
    } else {
      setShowVideo(false)
    }
  }, [hover])

  return (
    <div className="w-full relative rounded-md bg-pale overflow-hidden" style={{ paddingTop: '75%' }}>
      {device.breakpoint === 'sm' ? null : (
        <video
          src={videoSrc}
          ref={videoRef}
          className={`${
            showVideo ? 'opacity-100' : 'opacity-0 transition-opacity duration-150 ease-out'
          } absolute object-cover left-0 top-0 z-20`}
          autoPlay
          loop
          muted
          style={{ transform: 'scale(102%)' }}
        />
      )}
      <img
        src={imageSrc}
        className="absolute object-cover left-0 top-0 z-10"
        alt=""
        style={{ transform: 'scale(102%)' }}
      />
    </div>
  )
}
