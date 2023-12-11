import { signOut } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { NavAction } from '@/components/navbar/nav-action'
import { ScrollArea } from '@/components/ui/scroll-area'
import { NavItem } from '@/components/navbar/nav-item'
import { useModal } from '@/hooks/use-modal-store'
import { useServerStore } from '@/hooks/use-server-store'

function NavSidebar() {
  const { servers, update } = useServerStore()
  const { onOpen } = useModal()

  const getServers = useCallback(async () => {
    try {
      update()
    } catch (err) {
      console.log(err)
    }
  }, [update])

  useEffect(() => {
    getServers()
  }, [getServers])

  function handleAddServerClick() {
    onOpen('createServer')
  }

  // if (!servers.length) return null

  return (
    <div className="flex h-full w-full flex-col items-center space-y-4 bg-neutral-100 py-4 dark:bg-black">
      <NavAction
        label="Add a server"
        action="add"
        onClick={handleAddServerClick}
      />
      <Separator className="h-0.5 w-12 rounded-full bg-neutral-200 dark:bg-neutral-600" />
      <ScrollArea className="w-full flex-1">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavItem
              serverId={server.id}
              imageUrl={server.imageUrl}
              name={server.name}
            />
          </div>
        ))}
        {/* Mock for Server with no data found in db */}
        {/* <div key={'aaa'} className="mb-4">
            <NavItem
              serverId={'aaa'}
              imageUrl={servers[0].imageUrl}
              name={'aaa'}
            />
          </div> */}
      </ScrollArea>
      <NavAction label="Log Out" action="logout" onClick={signOut} />
    </div>
  )
}

export { NavSidebar }
