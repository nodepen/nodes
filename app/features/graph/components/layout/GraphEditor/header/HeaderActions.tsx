import React from 'react'
import { firebase } from 'features/common/context/session/auth'
import {
  CurrentUserButton,
  DownloadButton,
  SaveButton,
  ShareButton,
  SignInButton,
  SignUpButton,
  SolutionStatus,
} from './actions'
import { useSessionManager } from 'features/common/context/session'

type HeaderActionsProps = {
  graph: {
    id: string
  }
  user?: firebase.User
}

export const HeaderActions = ({ graph, user }: HeaderActionsProps): React.ReactElement => {
  const { device } = useSessionManager()

  switch (device.breakpoint) {
    case 'sm': {
      return (
        <>
          <SolutionStatus />
          {/* <CurrentUserButton user={user} /> */}
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
          <CurrentUserButton user={user} />
        </>
      ) : (
        <>
          <SolutionStatus />
          <DownloadButton />
          <SignInButton />
          <SignUpButton />
        </>
      )
    }
  }
}
