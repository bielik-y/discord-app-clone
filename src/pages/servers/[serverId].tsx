import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Server } from '@/types/models'
import { Spinner } from '@/components/ui/spinner'
import { MainLayout } from '@/components/layout/main-layout'
import { ServerSidebar } from '@/components/server/server-sidebar'
import { useServerStore } from '@/hooks/use-server-store'

export default function Server() {
  const params = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const { server, setServer, currentChannel } = useServerStore()

  const getServer = useCallback(async () => {
    try {
      setIsLoading(true)
      if (params) {
        console.log(params)
        if (typeof params.serverId === 'string') {
          await setServer(params.serverId)
        }
      }
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }, [params, setServer])

  useEffect(() => {
    getServer()
  }, [getServer])

  if (isLoading)
    return (
      <div className="h-screen w-full">
        <Spinner loading={isLoading} />
      </div>
    )
  if (!server) return <p>Data is not found</p>
  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-20 hidden h-full w-60 flex-col md:flex">
        <ServerSidebar server={server} />
      </div>
      <main className="h-full md:pl-60">{server.channels.find(channel => channel.id === currentChannel)?.name}</main>
    </div>
  )
}

Server.getLayout = (page: React.ReactNode) => {
  return <MainLayout>{page}</MainLayout>
}
