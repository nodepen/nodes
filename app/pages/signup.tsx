import { NextPage } from 'next'
import { useSessionManager } from '@/features/common/context/session'
import { ApolloContext } from '@/features/common/context/apollo'
import { SignUpForm } from '@/features/user-auth'

const SignUpPage: NextPage = () => {
  const { token } = useSessionManager()

  return (
    <ApolloContext token={token}>
      <SignUpForm />
    </ApolloContext>
  )
}

export default SignUpPage
