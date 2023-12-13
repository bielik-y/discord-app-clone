import { getServerSessionUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { GetServerSideProps } from 'next'
import { PathParamsContext } from 'next/dist/shared/lib/hooks-client-context.shared-runtime'

interface InviteCodeProps {
  inviteCode: string
}

export default function InviteCode({ inviteCode }: InviteCodeProps) {}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res, params } = context

  const user = await getServerSessionUser(req, res)
  const inviteCode = params?.inviteCode

  if (!user || !inviteCode || typeof inviteCode !== 'string')
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: inviteCode,
      members: {
        some: {
          userId: user.id
        }
      }
    }
  })

  if (existingServer)
    return {
      redirect: {
        destination: `/servers/${existingServer.id}`,
        permanent: false
      }
    }
  
    const server = await db.server.update({
      where: {
        inviteCode: inviteCode
      },
      data: {
        members: {
          create: [
            {
              userId: user.id
            }
          ]
        }
      }
    })
    if (server) 
    return {
      redirect: {
        destination: `/servers/${server.id}`,
        permanent: false
      }
    }

  return {
    redirect: {
      destination: '/404',
      permanent: false
    }
  }
}
