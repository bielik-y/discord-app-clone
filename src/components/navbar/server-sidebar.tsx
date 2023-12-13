import { Server } from '@/types/models'
import { useSession } from 'next-auth/react'
import { ServerHeader } from '@/components/navbar/server-header'

interface ServerSidebarProps {
  server: Server
}

function ServerSidebar({ server }: ServerSidebarProps) {
  const { data: session } = useSession()

  const textChannels = server.channels.filter(
    (channel) => channel.type === 'TEXT'
  )
  const audioChannels = server.channels.filter(
    (channel) => channel.type === 'AUDIO'
  )
  const videoChannels = server.channels.filter(
    (channel) => channel.type === 'VIDEO'
  )

  const members = server.members.filter(
    (member) => member.id !== session?.user.id
  )

  const role = server.members.find(
    (member) => member.user.id === session?.user.id
  )?.role

  return (
    <div className="flex h-full w-full flex-col bg-neutral-100 text-primary dark:bg-neutral-900">
      <ServerHeader server={server} role={role} />
    </div>
  )
}

export { ServerSidebar }
