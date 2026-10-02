import React from 'react'

type MenuHeaderProps = {
  icon: React.ReactNode
  label: string
}

export const MenuHeader = ({ icon, label }: MenuHeaderProps) => {
  return (
    <div className="np-w-full np-flex np-items-center np-pl-1 np-h-8 np-mb-1 last:np-mb-0 np-border-2 np-border-dark np-rounded-sm">
      <div className="np-w-[20px] np-min-w-[20px] np-h-full np-flex np-flex-col np-justify-center np-items-center">
        {icon}
      </div>
      <p className="np-pl-2 np-font-sans np-font-medium np-text-dark np-text-sm -np-translate-y-px np-whitespace-nowrap np-overflow-hidden">
        {label}
      </p>
    </div>
  )
}
