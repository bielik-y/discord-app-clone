import { cn } from '@/lib/utils'
import { Role } from '@prisma/client'
import { Member, Server } from '@/types'
import { useServerStore } from '@/hooks/use-server-store'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { UserAvatar } from '@/components/user-avatar'

interface ServerMemberProps {
  member: Member
  server: Server
  position: number
}

const roleIconMap = {
  [Role.GUEST]: null,
  [Role.MODERATOR]: <ShieldCheck className="ml-2 h-4 w-4 text-indigo" />,
  [Role.ADMIN]: <ShieldAlert className="ml-2 h-4 w-4 text-rose-500" />
}

function ServerMember({ member, server, position }: ServerMemberProps) {
  const { currentMember, setMember } = useServerStore()

  const icon = roleIconMap[member.role]

  function handleClick() {
    setMember(member.id)
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'group mb-1 flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50',
        currentMember === member.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
    >
      <UserAvatar
        className="h-8 w-8 md:h-8 md:w-8"
        memberName={member.user.username}
        positionForAvatar={position}
      />
      <p
        className={cn(
          'text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300',
          currentMember === member.id &&
            'text-black dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {member.user.username}
      </p>
      {icon}
    </button>
  )
}

export { ServerMember }
