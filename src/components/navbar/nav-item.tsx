import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useParams, useRouter } from 'next/navigation'
import { ActionTooltip } from '@/components/action-tooltip'

interface NavItemProps {
  serverId: string
  imageUrl: string
  name: string
}

// Server icon inside side navbar with hover animation
function NavItem({ serverId, imageUrl, name }: NavItemProps) {
  const params = useParams()
  const router = useRouter()

  function handleOnClick() {
    router.push(`/servers/${serverId}`)
  }
  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button
        onClick={handleOnClick}
        className="group relative flex items-center"
      >
        <div
          className={cn(
            'absolute left-0 w-1 rounded-r-full bg-primary transition-all',
            params?.serverId !== serverId && 'group-hover:h-10',
            params?.serverId === serverId ? 'h-9' : 'h-0'
          )}
        />
        <div
          className={cn(
            'group relative mx-4 flex h-12 w-12 overflow-hidden rounded-[24px] transition-all group-hover:rounded-[16px]',
            params?.serverId !== serverId &&
              'rounded=[16px] bg-primary/10 text-primary'
          )}
        >
          <Image fill src={imageUrl} alt="channel" />
        </div>
      </button>
    </ActionTooltip>
  )
}

export { NavItem }
