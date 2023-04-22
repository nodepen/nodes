import React from 'react'

type MenuSectionProps = {
  icon?: React.ReactNode
  title?: string
  background?: string
  children?: React.ReactNode
}

export const MenuSection = ({ icon, title, background, children }: MenuSectionProps) => {
  return (
    <div
      className="np-w-full last:np-mb-0 np-p-1 np-grid np-grid-cols-[20px_1fr] np-gap-2 np-rounded-sm"
      style={{ backgroundColor: background }}
    >
      <div className="np-w-full np-h-full np-flex np-flex-col np-justify-start np-items-center">
        <div className="np-w-5 np-h-6 np-flex np-justify-center np-items-center">{icon}</div>
      </div>
      <div className="np-w-full np-flex np-flex-col np-justify-start np-items-start">
        {title ? (
          <p className="np-font-sans np-font-medium np-text-dark np-text-sm np-translate-y-px">{title}</p>
        ) : null}
        {children}
      </div>
    </div>
  )
}
