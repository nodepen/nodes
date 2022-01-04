import React, { useEffect, useRef, useState } from 'react'
import { firebase } from 'features/common/context/session/auth/firebase'
import { AuthLayout } from './layout'
import { useRouter } from 'next/router'

export const PasswordResetForm = (): React.ReactElement => {
  const router = useRouter()
  const { oobCode } = router.query
  const code = oobCode?.toString() ?? ''

  const [isValidRequest, setIsValidRequest] = useState<boolean>()

  const userEmail = useRef<string>()

  useEffect(() => {
    firebase
      .auth()
      .verifyPasswordResetCode(code)
      .then((email) => {
        userEmail.current = email
        setIsValidRequest(true)
      })
      .catch(() => {
        setIsValidRequest(false)
      })
  }, [])

  const passwordInputRef = useRef<HTMLInputElement>(null)

  const [success, setSuccess] = useState<boolean>()

  const handlePasswordReset = (): void => {
    const email = userEmail.current
    const pw = passwordInputRef.current?.value

    if (!pw || pw.length < 6 || !email) {
      return
    }

    firebase
      .auth()
      .confirmPasswordReset(code, pw)
      .then(() => {
        setSuccess(true)
      })
      .catch(() => {
        setSuccess(false)
      })
      .finally(() => {
        setIsValidRequest(undefined)
      })
  }

  const invalidRequestContent = <p className="text-dark text-lg font-semibold">Invalid or expired request.</p>

  const validRequestContent = (
    <>
      <div className="w-full h-10 mt-2 pl-2 pr-2 rounded-md bg-white relative overflow-hidden">
        <div className="w-10 h-10 absolute left-0 top-0 z-10">
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="#333" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>
        <input
          className="w-full h-full pl-10 pr-3 absolute left-0 top-0 z-0"
          ref={passwordInputRef}
          placeholder="Password"
          type="password"
        />
      </div>
      <button
        onClick={handlePasswordReset}
        className={`w-full h-10 mt-2 mb-2 pl-2 pr-2 flex items-center justify-center rounded-md bg-green hover:bg-swampgreen`}
      >
        <p className={`font-semibold text-darkgreen`}>{'Reset Password'}</p>
      </button>
    </>
  )

  const successfulContent = <p className="text-dark text-lg font-semibold">Successfully reset password!</p>

  const unsuccessfulContent = <p className="text-dark text-lg font-semibold">Failed to reset password.</p>

  return (
    <AuthLayout>
      <div className="w-full p-4 flex flex-col" style={{ maxWidth: 250 }}>
        <div className="p-2 bg-pale rounded-md flex flex-col items-center">
          {isValidRequest === false ? invalidRequestContent : null}
          {isValidRequest === true ? validRequestContent : null}
          {success === false ? unsuccessfulContent : null}
          {success === true ? successfulContent : null}
        </div>
      </div>
    </AuthLayout>
  )
}
