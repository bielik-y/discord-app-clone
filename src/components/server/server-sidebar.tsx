import { Server } from '@/types'
import { useSession } from 'next-auth/react'
import { ChannelType, Role } from '@prisma/client'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ServerSection } from '@/components/server/server-section'
import { ServerChannel } from '@/components/server/server-channel'
import { ServerHeader } from '@/components/server/server-header'
import { ServerSearch } from '@/components/server/server-search'
import { ServerMember } from '@/components/server/server-member'

import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react'

interface ServerSidebarProps {
  server: Server
}

const channelIconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />
}

const roleIconMap = {
  [Role.GUEST]: null,
  [Role.MODERATOR]: <ShieldCheck className="mr-2 h-4 w-4 text-indigo" />,
  [Role.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />
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
    (member) => member.user.id !== session?.user.id
  )

  const role = server.members.find(
    (member) => member.user.id === session?.user.id
  )?.role

  return (
    <div className="flex h-full w-full flex-col bg-neutral-100 text-primary dark:bg-neutral-900">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: 'Text Channels',
                type: 'channel',
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type]
                }))
              },
              {
                label: 'Voice Channels',
                type: 'channel',
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type]
                }))
              },
              {
                label: 'Video Channels',
                type: 'channel',
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type]
                }))
              },
              {
                label: 'Members',
                type: 'member',
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.user.username,
                  icon: roleIconMap[member.role]
                }))
              }
            ]}
          />
        </div>
        <Separator className="my-2 rounded-md bg-zinc-200 dark:bg-zinc-800" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              label="Text channels"
              role={role}
            />
            <div className="space-y-[4px]">
              {textChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              label="Voice channels"
              role={role}
            />
            <div className="space-y-[4px]">
              {audioChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              label="Voice channels"
              role={role}
            />
            <div className="space-y-[4px]">
              {videoChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!members?.length && (
          <div className="mb-2">
            <ServerSection sectionType="members" label="Members" role={role} />
            {members.map((member, index) => (
              <ServerMember key={member.id} member={member} position={index} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

export { ServerSidebar }
