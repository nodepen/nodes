import { useRef } from 'react'

const Teaser = () => {
  const circleRef = useRef<HTMLDivElement>(null)
  return (  
  <div
    className="w-vw h-vh bg-green flex flex-col justify-evenly items-center lg:flex-row"
  >
    <div className="w-48 h-8 arrow">
      <svg width="192px" height="32" viewBox="0 0 192 32">
        <line
          x1="4"
          y1="16"
          x2="188"
          y2="16"
          stroke="#333333"
          stroke-width="0.8mm"
          stroke-linecap="round"
        />
        <line
          x1="188"
          y1="16"
          x2="174"
          y2="2"
          stroke="#333333"
          stroke-width="0.8mm"
          stroke-linecap="round"
        />
        <line
          x1="188"
          y1="16"
          x2="174"
          y2="30"
          stroke="#333333"
          stroke-width="0.8mm"
          stroke-linecap="round"
        />
      </svg>
    </div>
    <div
      ref={circleRef}
      className="w-76 h-76 lg:w-128 lg:h-128 rounded-full bg-pale overflow-hidden flex flex-col justify-center items-center"
    >
      <div id="#svg" ></div>
      <div
        className="card-mono w-64 lg:w-76 z-10 p-2 flex flex-col justify-center items-center"
      >
        <h1 className="font-display text-3xl mb-2">glasshopper.io</h1>
        <p className="font-sans font-semibold text-sm mb-2">COMING SOON</p>
      </div>
    </div>
    <div
      className="w-48 h-10 card-mono transition-all duration-150 ease-in-out hover:cursor-pointer transform translate-y-0 hover:translate-y-hov-sm flex flex-row"
    >
      <div className="w-10 border-r border-dark flex justify-center items-center">
        <img src="github.svg" width="24px" height="24px" />
      </div>
      <div className="flex-grow flex flex-row justify-center items-center">
        <a
          href="https://github.com/cdriesler/glasshopper.io"
          target="_blank"
          className="font-sans font-semibold text-sm"
          >VIEW UPDATES</a>
      </div>
    </div>
    <style jsx>{`
    .card-mono {
  @apply border-2 border-solid border-dark shadow-osm bg-light;
}

@keyframes arrowloop {
  from {
    transform: translateX(-15px);
  }
  to {
    transform: translateX(15px);
  }
}

.arrow {
  animation-name: arrowloop;
  animation-duration: 800ms;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}  
    `}</style>
  </div>)
}

export default Teaser