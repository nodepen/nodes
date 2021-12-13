import React from 'react'
import { AuthLayout } from './layout'

const SignInForm = (): React.ReactElement => {
  return (
    <AuthLayout>
      <div className="w-full p-4 flex flex-col" style={{ maxWidth: 250 }}>
        <div className="p-2 bg-pale rounded-md flex flex-col items-center">
          <h1 className="text-dark text-2xl font-semibold">Sign In</h1>
          <div className="w-full mb-2 flex items-center justify-center overflow-visible">
            {Array(7)
              .fill('')
              .map((_, i) => (
                <svg
                  key={`title-underline-${i}`}
                  width="25"
                  height="25"
                  viewBox="0 -2.5 10 10"
                  className="overflow-visible"
                >
                  <polyline
                    points="0,2.5 2.5,1 5,2.5 7.5,4 10,2.5"
                    fill="none"
                    stroke="#98E2C6"
                    strokeWidth="3px"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              ))}
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

export default React.memo(SignInForm)
