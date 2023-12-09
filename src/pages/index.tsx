import { getServerSession } from 'next-auth/next'
import { GetServerSideProps } from 'next'
import { authOptions } from './api/auth/[...nextauth]'

export default function Home() {
  return <p>Protected Route</p>
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
