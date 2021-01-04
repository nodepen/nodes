import React, { useState } from 'react'

type DataTreeProps = {
  label: string
  data: { [key: string]: string[] }
}

export const DataTreeContainer = ({ data, label }: DataTreeProps): React.ReactElement => {

  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full flex flex-col items-center">
      <button onClick={() => setIsOpen((current) => !current)} className="w-full mt-1 p-1 pl-2 pr-2 h-5 flex items-center rounded-sm rounded-b-none bg-green">
        <p className="flex-grow font-panel font-bold text-darkgreen text-xs text-left" style={{ transform: 'translateY(1px)' }}>
          {label}
        </p>
        <p className="text-sm text-pale">{isOpen ? <>&#9650;</> : <>&#9660;</>}</p>
      </button>
      {isOpen ? (
        <div className="w-full border-2 border-t-0 border-green rounded-sm rounded-t-none flex flex-col items-center font-panel">
          {Object.keys(data).map((key) => (
            <>
              <div className="w-full h-6 pl-1 pr-1 text-right text-sm text-swampgreen border-b-2 border-green">
                {key}
              </div>
              {data[key].map((value, i) => (
                <div className="w-full p-1 flex items-center h-5 text-sm text-swampgreen hover:text-darkgreen">
                  <div className="w-4 mr-2 text-left border-r-2 border-green">
                    {i}
                  </div>
                  {value}
                </div>
              ))}
            </>
          ))}
        </div>
      ) : null}
    </div>
  )
}