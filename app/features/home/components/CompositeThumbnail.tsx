import React, { useEffect, useRef, useState } from 'react'

type CompositeThumbnailProps = {
  imageSrc?: string
  videoSrc?: string
}

export const CompositeThumbnail = ({ imageSrc, videoSrc }: CompositeThumbnailProps): React.ReactElement => {
  const [showVideo, setShowVideo] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  return (
    <div
      className="w-full h-full relative"
      style={{ transform: 'translateY(-1px)' }}
      onPointerEnter={() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0
        }
        setShowVideo(true)
      }}
      onPointerLeave={() => {
        setShowVideo(false)
      }}
    >
      <video
        src={videoSrc}
        ref={videoRef}
        className={`${
          showVideo ? 'opacity-100' : 'opacity-0 transition-opacity duration-150 ease-out'
        } absolute object-cover left-0 top-0 z-20`}
        autoPlay
        loop
      />
      <img src={imageSrc} className="absolute object-cover left-0 top-0 z-10" />
    </div>
  )
}
