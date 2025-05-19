'use client'

import { signIn, signOut, useSession } from "next-auth/react"

type AuthPageCallbackProps = {
  accessCode: string
}

export const AuthPageCallback = ({ accessCode }: AuthPageCallbackProps) => {
  const session = useSession()

  if (session.status !== 'authenticated' && session.status !== 'loading') {
    if (!!accessCode) {
      signIn('credentials', { redirect: false, accessCode })
    }
  }

  console.log(session)

  return <div>
    <div>{session.data?.user?.name ?? 'No user'}</div>
    <button onClick={() => signOut({ redirect: false })}>Sign out</button>
  </div>
}