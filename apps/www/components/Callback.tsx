'use client'

import { useNodepenSession } from "@/hooks/useNodepenSession"
import { signOut } from "next-auth/react"


export const AuthPageCallback = () => {
  const { user, speckle } = useNodepenSession()

  return <div>
    <div>{user?.name ?? 'No user'}</div>
    <div>{speckle.token}</div>
    <button onClick={() => signOut({ redirect: false })}>Sign out</button>
  </div>
}