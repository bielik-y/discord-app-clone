import { AuthLayout } from '@/components/layout/auth-layout'
import { LoginForm } from '@/components/login-form'
import { SignUpForm } from '@/components/signup-form'
import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { LoadingOverlay } from '@/components/loading-overlay'

export default function Auth() {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) router.replace('/')
  }, [session, router])

  const switchAuthMode = useCallback(() => {
    setIsLoginMode((prev) => !prev)
  }, [])

  if (status !== 'unauthenticated') return <LoadingOverlay loading={true} />

  return (
    <AuthLayout>
      {isLoginMode ? (
        <LoginForm switchModeHandler={switchAuthMode} />
      ) : (
        <SignUpForm switchModeHandler={switchAuthMode} />
      )}
    </AuthLayout>
  )
}