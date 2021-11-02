import { useState } from 'react'
import { useGraphId } from '@/features/graph/store/graph/hooks'
import { useSolutionDispatch, useSolutionMetadata } from '@/features/graph/store/solution/hooks'
import { useApolloClient, gql } from '@apollo/client'
import { useSessionManager } from '../context/session'
import { SolutionStatusPip } from './components'
import { UserImage } from './header'
import { ModalLayout } from './ModalLayout'
// import { useOutsideClick } from '@/hooks'
// import { SignUpMenu, UserImage, UserMenu } from './header'

type EditorLayoutProps = {
  children?: JSX.Element
}

export const EditorLayout = ({ children }: EditorLayoutProps): React.ReactElement => {
  const { user } = useSessionManager()

  const isAnonymous = user?.isAnonymous ?? true

  // const menuRef = useRef<HTMLDivElement>(null)

  // const [menuVisible, setMenuVisible] = useState(false)
  // const [menuContent, setMenuContent] = useState<JSX.Element>()

  // const handleOutsideClick = useCallback(() => {
  //   setMenuVisible(false)
  // }, [])

  // useOutsideClick(menuRef, handleOutsideClick)

  const client = useApolloClient()
  const graphId = useGraphId()

  const { expireSolution } = useSolutionDispatch()
  const { id: solutionId } = useSolutionMetadata()

  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = (): void => {
    if (isDownloading) {
      return
    }

    setIsDownloading(true)

    client
      .query({
        query: gql`
          query GetSolutionGrasshopperFile($graphId: String!, $solutionId: String!) {
            solution(graphId: $graphId, solutionId: $solutionId) {
              files {
                gh
              }
            }
          }
        `,
        variables: {
          graphId,
          solutionId,
        },
      })
      .then((res) => {
        const { gh } = res.data.solution.files

        if (gh) {
          let fileData: any = atob(gh)

          const bytes = new Array(fileData.length)
          for (let i = 0; i < fileData.length; i++) {
            bytes[i] = fileData.charCodeAt(i)
          }
          fileData = new Uint8Array(bytes)

          const blob = new Blob([fileData])
          const objectURL = window.URL.createObjectURL(blob)
          const anchor = document.createElement('a')

          anchor.href = objectURL
          anchor.download = 'nodepen.gh'
          anchor.click()

          URL.revokeObjectURL(objectURL)
        } else {
          console.error('🐍 Failed to download grasshopper file for current solution.')
          expireSolution()
        }
      })
      .catch((err) => {
        console.error('🐍 Failed to download grasshopper file for current solution.')
      })
      .finally(() => {
        setIsDownloading(false)
      })
  }

  const [showUserModal, setShowUserModal] = useState(false)

  return (
    <>
      <div className="w-vw h-vh flex flex-col justify-start overflow-visible" id="layout-root">
        <div
          className="w-full h-10 flex justify-start items-center bg-white border-b-2 border-dark"
          style={{ zIndex: 99998 }}
        >
          <a className="p-0 mr-4 w-12 h-full flex justify-center items-center" href="/">
            <img
              src="/nodepen.svg"
              width="30"
              height="28"
              alt="The NodePen logo: an 'N' followed by a 'P', both fit into narrow rounded-rectangle geometry. A hollow circle punctuates the space left over under the P. This shape is a reference to the grip geometry used to connect graph nodes."
            />
          </a>
          <div className="flex-grow h-full p-1 pr-2 flex justify-end items-center">
            <div className="h-6 mr-2">
              <SolutionStatusPip />
            </div>
            <button
              className="h-6 w-6 mr-2 border-2 border-dark rounded-sm bg-white flex items-center justify-center"
              onClick={handleDownload}
            >
              <svg className="w-4 h-4" fill="#333333" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              className={`${isAnonymous ? 'border-2 border-dark' : ''} h-6 w-6 rounded-sm bg-white overflow-hidden`}
              onClick={() => setShowUserModal(true)}
            >
              <UserImage />
            </button>
          </div>
        </div>
        {children}
      </div>
      {showUserModal ? (
        <ModalLayout onClose={() => setShowUserModal(false)}>
          <p className="w-full">Howdy</p>
        </ModalLayout>
      ) : null}
    </>
  )
}
