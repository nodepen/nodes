'use client'

import { SessionProvider } from 'next-auth/react'

type AuthSessionProviderProps = {
  children?: React.ReactNode
}

export const AuthSessionProvider = ({ children }: AuthSessionProviderProps) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}