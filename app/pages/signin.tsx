import { NextPage } from 'next'
import { firebase } from 'features/common/context/session/auth'
import { useEffect } from 'react'
import { useSessionManager } from '@/features/common/context/session'
import { useRouter } from 'next/router'

const SignInPage: NextPage = () => {
  const router = useRouter()

  const { user } = useSessionManager()

  return <div className="w-vw h-vh flex flex-col items-center justify-center"></div>
}

export default SignInPage
