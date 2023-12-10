import axios from 'axios'
import { Server } from '@/types/models'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { NavAction } from '@/components/navbar/nav-action'
import { ScrollArea } from '@/components/ui/scroll-area'
import { NavItem } from '@/components/navbar/nav-item'

function NavSidebar() {
  const [servers, setServers] = useState<Server[]>([])
  const router = useRouter()

  const getServers = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/server')
      if (!data.servers || !data.servers.length) router.replace('/')
      setServers(data.servers)
    } catch (err) {
      console.log(err)
    }
  }, [router])

  useEffect(() => {
    getServers()
  }, [getServers])

  function handleAddServerClick() {
    // Create server logic
  }

  if (!servers.length) return null

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
        <div key={'kkk'} className="mb-4">
          <NavItem
            serverId={'mmm'}
            imageUrl={servers[0].imageUrl}
            name={'jjjj'}
          />
        </div>
      </ScrollArea>
      <NavAction label="Log Out" action="logout" onClick={signOut} />
    </div>
  )
}

export { NavSidebar }
