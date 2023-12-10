import { Plus } from 'lucide-react'
import { LogOut } from 'lucide-react'
import { ActionTooltip } from '@/components/navbar/action-tooltip'

interface NavActionProps {
  action: 'add' | 'logout'
  label: string
  onClick: () => void
}

function NavAction({ action, label, onClick }: NavActionProps) {
  return (
    <ActionTooltip side="right" align="center" label={label}>
      <button className="group flex items-center" onClick={onClick}>
        <div className="mx-3 flex  h-12 w-12 items-center justify-center overflow-hidden rounded-[24px] bg-neutral-200 transition-all group-hover:rounded-[16px] group-hover:bg-indigo-600 dark:bg-neutral-700">
          {action === 'add' && (
            <Plus className="text-indigo transition group-hover:text-white" />
          )}
          {action === 'logout' && (
            <LogOut className="text-primary transition group-hover:text-white" />
          )}
        </div>
      </button>
    </ActionTooltip>
  )
}

export { NavAction }
