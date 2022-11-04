import type React from 'react'

type RootLayoutProps = {
  children: React.ReactNode
}

const RootLayout = ({ children }: RootLayoutProps): React.ReactElement => {
  return <div className="w-vw h-vh flex justify-center items-center">{children}</div>
}

export default RootLayout
