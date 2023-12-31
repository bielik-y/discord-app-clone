import { useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { ErrorToast } from '@/components/error-toast'
import { Separator } from '@/components/ui/separator'
import { NavAction } from '@/components/navbar/nav-action'
import { ScrollArea } from '@/components/ui/scroll-area'
import { NavItem } from '@/components/navbar/nav-item'
import { useModal } from '@/hooks/use-modal-store'
import { useServerStore } from '@/hooks/use-server-store'

function NavSidebar() {
  const { userServers, updateUserServers } = useServerStore()
  const { onOpen } = useModal()

  const getServers = useCallback(async () => {
    try {
      await updateUserServers()
    } catch (err) {
      toast(<ErrorToast error={err} />)
    }
  }, [updateUserServers])

  useEffect(() => {
    getServers()
  }, [getServers])

  function handleAddServerClick() {
    onOpen('createServer')
  }

  return (
    <div className="flex h-full w-full flex-col items-center space-y-4 bg-[#E3E5E8] py-4 dark:bg-black">
      <NavAction
        label="Add a server"
        action="add"
        onClick={handleAddServerClick}
      />
      <Separator className="h-0.5 w-12 rounded-full bg-neutral-50 dark:bg-neutral-600" />
      <ScrollArea className="w-full flex-1">
        {userServers.map((server) => (
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
      <NavAction
        label="Log Out"
        action="logout"
        onClick={() => onOpen('logout')}
      />
    </div>
  )
}

export { NavSidebar }
