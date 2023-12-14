import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Server } from '@/types/models'
import { Spinner } from '@/components/ui/spinner'
import { MainLayout } from '@/components/layout/main-layout'
import { ServerSidebar } from '@/components/navbar/server-sidebar'
import { useServerStore } from '@/hooks/use-server-store'

export default function Server() {
  const params = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const { current, updateCurrent } = useServerStore()

  const getServer = useCallback(async () => {
    try {
      setIsLoading(true)
      if (params) {
        if (typeof params.serverId === 'string') {
          await updateCurrent(params.serverId)
        }
      }
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }, [params, updateCurrent])

  useEffect(() => {
    getServer()
  }, [getServer])

  if (isLoading)
    return (
      <div className="h-screen w-full">
        <Spinner loading={isLoading} />
      </div>
    )
  if (!current) return <p>Data is not found</p>
  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-20 hidden h-full w-60 flex-col md:flex">
        <ServerSidebar server={current} />
      </div>
      <main className="h-full md:pl-60">{current.name}</main>
    </div>
  )
}

Server.getLayout = (page: React.ReactNode) => {
  return <MainLayout>{page}</MainLayout>
}
