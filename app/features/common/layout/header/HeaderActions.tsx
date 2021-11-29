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

type HeaderActionsProps = {
  graph: {
    id: string
  }
  user?: firebase.User
}

export const HeaderActions = ({ graph, user }: HeaderActionsProps): React.ReactElement => {
  return user ? (
    <>
      <SolutionStatus />
      <SaveButton />
      <DownloadButton graphId={graph.id} />
      <ShareButton graphId={graph.id} />
      <CurrentUserButton user={user} />
    </>
  ) : (
    <>
      <SolutionStatus />
      <DownloadButton graphId={graph.id} />
      <SignInButton />
      <SignUpButton />
    </>
  )
}
