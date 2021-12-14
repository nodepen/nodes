import { NextPage } from 'next'
import { useSessionManager } from '@/features/common/context/session'
import { ApolloContext } from '@/features/common/context/apollo'
import { SignInForm } from '@/features/user-auth'

const SignInPage: NextPage = () => {
  const { token } = useSessionManager()

  return (
    <ApolloContext token={token}>
      <SignInForm />
    </ApolloContext>
  )
}

export default SignInPage
