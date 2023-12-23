import axios from 'axios'
import qs from 'query-string'
import { Role } from '@prisma/client'
import { useState } from 'react'
import { useModal } from '@/hooks/use-modal-store'
import { useServerStore } from '@/hooks/use-server-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UserAvatar } from '@/components/user-avatar'
import {
  Check,
  Gavel,
  Loader2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  MoreVertical,
  ShieldQuestion
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu'

const roleIcons = {
  GUEST: null,
  MODERATOR: (
    <ShieldCheck className="ml-2 h-4 w-4 text-indigo-dark dark:text-indigo-light" />
  ),
  ADMIN: <ShieldAlert className="ml-2 h-4 w-4 text-rose-500" />
}

function MembersModal() {
  const { isOpen, onClose, type } = useModal()

  const { server, updateServer } = useServerStore()
  const [loadingId, setLoadingId] = useState<string>()

  const isModalOpen = isOpen && type === 'members'

  async function handleRoleChange(
    memberId: string,
    memberRole: string,
    newRole: Role
  ) {
    if (memberRole !== newRole) {
      try {
        if (server) {
          setLoadingId(memberId)
          const url = qs.stringifyUrl({
            url: `/api/server/member/${memberId}`,
            query: { serverId: server?.id }
          })
          const { data } = await axios.patch(url, { role: newRole })
          updateServer(data.server)
        }
      } catch (err) {
        console.log(err)
      } finally {
        setLoadingId('')
      }
    }
  }

  async function handleKickMember(memberId: string) {
    try {
      if (server) {
        setLoadingId(memberId)
        const url = qs.stringifyUrl({
          url: `/api/server/member/${memberId}`,
          query: { serverId: server?.id }
        })
        const { data } = await axios.delete(url)
        updateServer(data.server)
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingId('')
    }
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="px-8 pt-8">
          <DialogTitle className="text-center text-2xl">
            Manage members
          </DialogTitle>
          <DialogDescription className="text-center text-neutral-500">
            {server?.members.length === 1
              ? `${server?.members.length} Member`
              : `${server?.members.length} Members`}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members.map((member, index) => (
            <div key={member.id} className="mb-6 flex items-center gap-x-2">
              <UserAvatar member={member} positionForAvatar={index} />
              <div className="ml-1 flex flex-col gap-y-1">
                <div className="flex items-center text-sm font-semibold">
                  {member.user.username}
                  {roleIcons[member.role]}
                </div>
                <p className="text-xs text-neutral-500">{member.user.email}</p>
              </div>
              {server.userId !== member.user.id && loadingId !== member.id && (
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="h-4 w-4 text-neutral-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center">
                          <ShieldQuestion className="mr-2 h-4 w-4" />
                          <span>Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                              onClick={() =>
                                handleRoleChange(
                                  member.id,
                                  member.role,
                                  'GUEST'
                                )
                              }
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              <p className="pr-1">Guest</p>
                              {member.role === 'GUEST' && (
                                <Check className="ml-auto h-4 w-4" />
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleRoleChange(
                                  member.id,
                                  member.role,
                                  'MODERATOR'
                                )
                              }
                            >
                              <ShieldCheck className="mr-2 h-4 w-4" />
                              <p className="pr-1">Moderator</p>
                              {member.role === 'MODERATOR' && (
                                <Check className="ml-auto h-4 w-4" />
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleKickMember(member.id)}
                      >
                        <Gavel className="mr-2 h-4 w-4" />
                        Kick
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {loadingId === member.id && (
                <Loader2 className="ml-auto h-4 w-4 animate-spin text-zinc-500" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export { MembersModal }
