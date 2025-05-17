import type React from 'react'

type RootLayoutProps = {
  children: React.ReactNode
}

const RootLayout = ({ children }: RootLayoutProps): React.ReactElement => {
  return (
    <html lang="en-US">
      <head></head>
      <body>
        <div className="w-vw h-vh flex justify-center items-center">{children}</div>
      </body>
    </html>
  )
}

export default RootLayout
