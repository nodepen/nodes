import React from 'react'
import { firebase } from 'features/common/context/session/auth'
import { DownloadButton, SaveButton, ShareButton, SmallDeviceButton, SolutionStatus } from './actions'
import { useSessionManager } from 'features/common/context/session'
import { Layout } from 'features/common'
import { useRouter } from 'next/router'

type HeaderActionsProps = {
  user?: firebase.User
}

export const HeaderActions = ({ user }: HeaderActionsProps): React.ReactElement => {
  const router = useRouter()

  const { device } = useSessionManager()

  const isNewGraph = router.pathname === '/gh'

  const downloadButtonOrNull = isNewGraph ? null : <DownloadButton />

  switch (device.breakpoint) {
    case 'sm': {
      return user ? (
        <>
          <SolutionStatus />
          <SaveButton />
          <SmallDeviceButton user={user} />
        </>
      ) : (
        <>
          <SolutionStatus />
          {downloadButtonOrNull}
          <Layout.HeaderActions.SignInButton />
          <Layout.HeaderActions.SignUpButton />
        </>
      )
    }
    default: {
      return user ? (
        <>
          <SolutionStatus />
          <SaveButton />
          {downloadButtonOrNull}
          <ShareButton />
          <Layout.HeaderActions.CurrentUserButton user={user} color="dark" />
        </>
      ) : (
        <>
          <SolutionStatus />
          {downloadButtonOrNull}
          <Layout.HeaderActions.SignInButton />
          <Layout.HeaderActions.SignUpButton />
        </>
      )
    }
  }
}
