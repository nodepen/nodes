import React from 'react'

type ValidationErrorProps = {
  message: string
}

export const ValidationErrorMessage = ({ message }: ValidationErrorProps): React.ReactElement => {
  return (
    <div className="w-full container">
      <div className="w-10 flex flex-col justify-start">
        <div className="w-full h-6 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-error" />
        </div>
      </div>
      <div className="flex flex-col pt-1">
        <p className="leading-4 text-sm text-error font-bold">{message}</p>
      </div>
      <style jsx>{`
        @keyframes appear {
          from {
            max-height: 0px;
          }
          to {
            max-height: 100px;
          }
        }

        .container {
          display: grid;
          grid-template-columns: 40px 1fr;

          animation-name: appear;
          animation-duration: 250ms;
          animation-fill-mode: forwards;
          animation-timing-function: ease-out;
        }
      `}</style>
    </div>
  )
}
