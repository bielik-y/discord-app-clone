import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Server } from '@/types'
import { toast } from 'sonner'
import { ErrorToast } from '@/components/error-toast'
import { Spinner } from '@/components/ui/spinner'
import { MainLayout } from '@/components/layout/main-layout'
import { ServerSidebar } from '@/components/server/server-sidebar'
import { useServerStore } from '@/hooks/use-server-store'
import { Channel } from '@/components/channel'
import { MobileToggle } from '@/components/mobile-toggle'
import { Conversation } from '@/components/conversation'

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
      toast(<ErrorToast error={err} />)
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

  const memberParams = {
    serverId: server.id,
    memberId: currentMember!
  }

  return (
    <div className="h-full">
      <MobileToggle />
      <div className="fixed inset-y-0 z-20 hidden h-full w-60 flex-col md:flex">
        <ServerSidebar server={server} />
      </div>
      <main className="h-full md:pl-60">
        {currentChannel && !currentMember && <Channel params={channelParams} />}
        {currentMember && !currentChannel && (
          <Conversation params={memberParams} />
        )}
      </main>
    </div>
  )
}

Server.getLayout = (page: React.ReactNode) => {
  return <MainLayout>{page}</MainLayout>
}
