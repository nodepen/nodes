import React from 'react'
import { firebase } from 'features/common/context/session/auth'
import { DownloadButton, SaveButton, ShareButton, SmallDeviceButton, SolutionStatus } from './actions'
import { useSessionManager } from 'features/common/context/session'
import { Layout } from 'features/common'

type HeaderActionsProps = {
  user?: firebase.User
}

export const HeaderActions = ({ user }: HeaderActionsProps): React.ReactElement => {
  const { device } = useSessionManager()

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
          <DownloadButton />
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
          <DownloadButton />
          <ShareButton />
          <Layout.HeaderActions.CurrentUserButton user={user} color="dark" />
        </>
      ) : (
        <>
          <SolutionStatus />
          <DownloadButton />
          <Layout.HeaderActions.SignInButton />
          <Layout.HeaderActions.SignUpButton />
        </>
      )
    }
  }
}
