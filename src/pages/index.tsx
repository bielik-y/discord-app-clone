import { signOut } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'
// import { navigateProtectedRoute } from '@/lib/auth'
import { getServerSession } from 'next-auth/next'
import { User } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'
import InitialModal from '@/components/modals/initial-modal'

export default function Home() {
  return (
    <div>
      <InitialModal />
      <Button onClick={() => signOut()}>Sign Out</Button>
    </div>
  )
}

// Redirect user to /login if session doesn't exist
export const getServerSideProps: GetServerSideProps = async (context) => {
  // const props = await navigateProtectedRoute(context)
  // return props
  const { req, res } = context
  const session = await getServerSession(req, res, authOptions)
  console.log('GET SERVER SIDE PROPS', session)

  if (!session)
    return {
      redirect: {
        destination: '/auth',
        permanent: false
      }
    }
  else {
    const server = (session.user as User).server
    if (server)
      return {
        redirect: {
          destination: `/server/${server}`,
          permanent: false
        }
      }
    else
      return {
        props: {}
      }
  }
  }
