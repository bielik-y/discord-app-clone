import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Server } from '@/types/models'
import { Spinner } from '@/components/ui/spinner'
import { MainLayout } from '@/components/layout/main-layout'
import { ServerSidebar } from '@/components/server/server-sidebar'
import { useServerStore } from '@/hooks/use-server-store'
import { Channel } from '@/components/channel'
import { MobileToggle } from '@/components/mobile-toggle'

export default function Server() {
  const params = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const { server, setServer, currentChannel, currentMember } = useServerStore()

  const getServer = useCallback(async () => {
    try {
      setIsLoading(true)
      if (params) {
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

  if (!server) return null

  const channelParams = {
    serverId: server.id,
    channelId: currentChannel!
  }

  return (
    <div className="h-full">
      <MobileToggle />
      <div className="fixed inset-y-0 z-20 hidden h-full w-60 flex-col md:flex">
        <ServerSidebar server={server} />
      </div>
      <main className="h-full md:pl-60">
        {currentChannel && !currentMember && <Channel params={channelParams} />}
        {currentMember &&
          !currentChannel &&
          server.members.find((member) => member.id === currentMember)?.user
            .username}
      </main>
    </div>
  )
}

Server.getLayout = (page: React.ReactNode) => {
  return <MainLayout>{page}</MainLayout>
}
