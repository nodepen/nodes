import React from 'react'
import { COLORS } from '@/constants'

type MenuSectionProps = {
  icon?: React.ReactNode
  title?: string
  background?: string
  children?: React.ReactNode
}

export const MenuSection = ({ icon, title, background, children }: MenuSectionProps) => {
  return (
    <div
      className={`np-w-full np-mb-1 last:np-mb-0 np-p-1 np-flex np-rounded-sm`}
      style={{ backgroundColor: background }}
    >
      {children}
    </div>
  )
}
