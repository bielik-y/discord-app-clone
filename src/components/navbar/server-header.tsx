import { Role } from '@prisma/client'
import { Server } from '@/types/models'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem, 
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from 'lucide-react'

interface ServerHeaderProps {
  server: Server
  role?: Role
}

function ServerHeader({ server, role }: ServerHeaderProps) {
  const isAdmin = role === Role.ADMIN
  const isModerator = isAdmin || role === Role.MODERATOR
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="text-md flex h-12 w-full items-center border-b-2 border-neutral-200 px-3 font-semibold transition hover:bg-zinc-700/10 dark:border-neutral-800 dark:hover:bg-zinc-700/50">{server.name}
        <ChevronDown className='h-5 w-5 ml-auto'/>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]'>
        { isModerator && (<DropdownMenuItem className='text-indigo-dark dark:text-indigo-light px-3 py-2 text-sm cursor-pointer'>Invite friends<UserPlus className='h-4 w-4 ml-auto'/></DropdownMenuItem>)}
        { isAdmin && (<DropdownMenuItem className=' px-3 py-2 text-sm cursor-pointer'>Server settings<Settings className='h-4 w-4 ml-auto'/></DropdownMenuItem>)}
        { isAdmin && (<DropdownMenuItem className=' px-3 py-2 text-sm cursor-pointer'>Manage members<Users className='h-4 w-4 ml-auto'/></DropdownMenuItem>)}
        { isModerator && (<DropdownMenuItem className=' px-3 py-2 text-sm cursor-pointer'>Create channel<PlusCircle className='h-4 w-4 ml-auto'/></DropdownMenuItem>)}
        { isModerator && (<DropdownMenuSeparator/>)}
        { isAdmin && (<DropdownMenuItem className=' text-rose-700 px-3 py-2 text-sm cursor-pointer'>Delete server<Trash className='h-4 w-4 ml-auto'/></DropdownMenuItem>)}
        { !isAdmin && (<DropdownMenuItem className=' text-rose-700 px-3 py-2 text-sm cursor-pointer'>Leave server<LogOut className='h-4 w-4 ml-auto'/></DropdownMenuItem>)}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ServerHeader }
