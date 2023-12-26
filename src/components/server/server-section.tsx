import { Role } from '@prisma/client'
import { ActionTooltip } from '../action-tooltip'
import { Settings } from 'lucide-react'
import { useModal } from '@/hooks/use-modal-store'

interface ServerSectionProps {
  label: string
  role?: Role
  sectionType: 'channels' | 'members'
}

function ServerSection({ label, role, sectionType }: ServerSectionProps) {
  const { onOpen } = useModal()
  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role === Role.ADMIN && sectionType === 'members' && (
        <ActionTooltip label="Manage Members" side="top" align="center">
          <button
            onClick={() => onOpen('members')}
            className="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  )
}

export { ServerSection }
