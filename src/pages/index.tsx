import type { GetServerSideProps } from 'next'
import { getServerSessionUser } from '@/lib/auth'
import { InitialModal } from '@/components/modals/initial-modal'

export default function Home() {
  return (
    <div>
      <InitialModal />
    </div>
  )
}

// Redirect user to /auth if session doesn't exist
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context
  const user = await getServerSessionUser(req, res)

  if (!user)
    return {
      redirect: {
        destination: '/auth',
        permanent: false
      }
    }
  else {
    const server = user.server
    if (server)
      return {
        redirect: {
          destination: `/servers/${server}`,
          permanent: false
        }
      }
    else
      return {
        props: {}
      }
  }
}
