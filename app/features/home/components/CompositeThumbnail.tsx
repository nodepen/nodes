import React, { useRef, useState } from 'react'

type CompositeThumbnailProps = {
  imageSrc?: string
  videoSrc?: string
}

export const CompositeThumbnail = ({ imageSrc, videoSrc }: CompositeThumbnailProps): React.ReactElement => {
  const [showVideo, setShowVideo] = useState(false)
  const startAutoPlay = useRef(false)

  return (
    <div
      className="w-full h-full relative"
      onPointerEnter={() => {
        startAutoPlay.current = true
        setShowVideo(true)
      }}
      onPointerLeave={() => {
        setShowVideo(false)
      }}
    >
      <video
        src={videoSrc}
        className={`${
          showVideo ? 'opacity-100' : 'opacity-0'
        } absolute left-0 top-0 z-20 transition-opacity duration-150 ease-out`}
        autoPlay={startAutoPlay.current}
        loop
      />
      <img src={imageSrc} className="absolute left-0 top-0 z-10" />
    </div>
  )
}
