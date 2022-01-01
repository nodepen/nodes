import React from 'react'

type ColumnsLayoutProps = {
  gap?: number
  children: JSX.Element[]
}

export const ColumnsLayout = ({ gap = 16, children }: ColumnsLayoutProps): React.ReactElement => {
  return (
    <div className="w-full container">
      {children}
      <style jsx>{`
        .container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          grid-gap: ${gap}px;
        }
      `}</style>
    </div>
  )
}
