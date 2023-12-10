import React from 'react'
import type { GetServerSideProps } from 'next'
import { MainLayout } from '@/components/layout/main-layout'
import { getServerSessionUser } from '@/lib/auth'
import { getServerById } from '@/lib/db'

interface ServerProps {
  server: {
    id: string
    name: string
    imageUrl: string
    inviteCode: string
  }
}

export default function Server({ server }: ServerProps) {
  if (!server) return <p>Data is not found</p>
  return <p>{server.name}</p>
}

Server.getLayout = (page: React.ReactNode) => {
  return <MainLayout>{page}</MainLayout>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params, req, res } = context
  const user = await getServerSessionUser(req, res)
  if (!user || !params)
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  else {
    const serverId = params.serverId
    if (typeof serverId === 'string') {
      const server = await getServerById(serverId)
      if (server) {
        return {
          props: {
            server: {
              id: server.id,
              name: server.name,
              imageUrl: server.imageUrl,
              inviteCode: server.inviteCode
            }
          }
        }
      } else
        return {
          props: {}
        }
    }
  }
  return {
    redirect: {
      destination: '/500',
      permanent: false
    }
  }
}
