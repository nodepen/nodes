// import { useState, useRef, useCallback } from 'react'
// import { useSessionManager } from 'context/session'
// import { useOutsideClick } from '@/hooks'
// import { SignUpMenu, UserImage, UserMenu } from './header'

type EditorLayoutProps = {
  children?: JSX.Element
}

export const EditorLayout = ({ children }: EditorLayoutProps): React.ReactElement => {
  // const { user } = useSessionManager()

  // const isAnonymous = user?.isAnonymous ?? true

  // const menuRef = useRef<HTMLDivElement>(null)

  // const [menuVisible, setMenuVisible] = useState(false)
  // const [menuContent, setMenuContent] = useState<JSX.Element>()

  // const handleOutsideClick = useCallback(() => {
  //   setMenuVisible(false)
  // }, [])

  // useOutsideClick(menuRef, handleOutsideClick)

  return (
    <div className="w-vw h-vh flex flex-col justify-start overflow-visible">
      {/* <div
        className={`${
          menuVisible ? 'border-b-2 border-dark' : 'border-b-0'
        } fixed w-vw pl-2 pr-2 max-h-0 bg-white z-50 overflow-hidden`}
        style={{ maxHeight: menuVisible ? '25vh' : 0, top: 35, transition: 'max-height 150ms', zIndex: 99999 }}
        ref={menuRef}
      >
        <div className="w-full pt-2 pb-4 flex flex-col items-end">{menuContent}</div>
      </div> */}
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
          {/* {isAnonymous ? (
            <>
              <button className="h-full mr-1 pl-2 pr-2 flex justify-center items-center border-dark border-2 rounded-md text-sm text-dark font-semibold font-sans">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="#333"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <p style={{ transform: 'translateY(-1px)' }}>Save</p>
              </button>
              <button className="h-full mr-1 pl-2 pr-2 white border-2 border-dark rounded-md text-sm text-dark font-semibold font-sans">
                <p style={{ transform: 'translateY(-1px)' }}>Log In</p>
              </button>
              <button
                className="h-full pl-2 pr-2 bg-dark rounded-md text-sm text-white font-semibold font-sans"
                onClick={() => {
                  setMenuContent(<SignUpMenu />)
                  setMenuVisible(true)
                }}
              >
                <p style={{ transform: 'translateY(-1px)' }}>Sign Up</p>
              </button>
            </>
          ) : (
            <>
              <button className="h-full mr-1 pl-2 pr-2 flex justify-center items-center border-dark border-2 rounded-md text-sm text-dark font-semibold font-sans">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <p style={{ transform: 'translateY(-1px)' }}>Share</p>
              </button>
              <button className="h-full mr-1 pl-2 pr-2 flex justify-center items-center border-dark border-2 rounded-md text-sm text-dark font-semibold font-sans">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="#333"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <p style={{ transform: 'translateY(-1px)' }}>Save</p>
              </button>
              <button
                className="h-full bg-dark rounded-md overflow-hidden"
                style={{ width: 28 }}
                onClick={() => {
                  setMenuContent(<UserMenu />)
                  setMenuVisible(true)
                }}
              >
                <UserImage />
              </button>
            </>
          )} */}
        </div>
      </div>
      {children}
    </div>
  )
}
