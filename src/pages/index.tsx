import { getServerSession } from 'next-auth/next'
import { signOut } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import { authOptions } from './api/auth/[...nextauth]'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'

export default function Home() {
  return (
    <div>
      <p>Protected Route</p>
      <Button onClick={() => signOut()}>Sign Out</Button>
      <ModeToggle />
    </div>
  )
}

// Redirect user to /login if session doesn't exist
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false
      }
    }
  } else {
    return {
      props: {}
    }
  }
}
