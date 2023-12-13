import { Role } from '@prisma/client'
import { Server } from '@/types/models'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users
} from 'lucide-react'
import { useModal } from '@/hooks/use-modal-store'

interface ServerHeaderProps {
  server: Server
  role?: Role
}

function ServerHeader({ server, role }: ServerHeaderProps) {
  const { onOpen } = useModal()

  const isAdmin = role === Role.ADMIN
  const isModerator = isAdmin || role === Role.MODERATOR
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="text-md flex h-12 w-full items-center border-b-2 border-neutral-200 px-3 font-semibold transition hover:bg-zinc-700/10 dark:border-neutral-800 dark:hover:bg-zinc-700/50">
          <h1 className='truncate'>{server.name}</h1>
          <ChevronDown className="ml-auto h-5 w-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 space-y-[2px] text-xs font-medium text-black dark:text-neutral-400">
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen('invite', { server })}
            className="cursor-pointer px-3 py-2 text-sm text-indigo-dark dark:text-indigo-light"
          >
            Invite friends
            <UserPlus className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className=" cursor-pointer px-3 py-2 text-sm">
            Server settings
            <Settings className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className=" cursor-pointer px-3 py-2 text-sm">
            Manage members
            <Users className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem className=" cursor-pointer px-3 py-2 text-sm">
            Create channel
            <PlusCircle className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem className=" cursor-pointer px-3 py-2 text-sm text-rose-700">
            Delete server
            <Trash className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem className=" cursor-pointer px-3 py-2 text-sm text-rose-700">
            Leave server
            <LogOut className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ServerHeader }
