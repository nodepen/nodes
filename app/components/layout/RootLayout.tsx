import React from 'react'

type RootLayoutProps = {
  children?: React.ReactNode
}

export const RootLayout = ({ children }: RootLayoutProps): JSX.Element => {
  return (
    <div className="w-vw h-vh p-0 flex flex-col overflow-hidden">
      <div className="w-full h-10 min-h-10 pl-8 pr-8 border-b-2 border-dark bg-light flex flex-row justify-center items-center">
        <a className="font-display text-lg no-underline select-none" href="/">
          glasshopper.io
        </a>
      </div>
      {children}
    </div>
  )
}
