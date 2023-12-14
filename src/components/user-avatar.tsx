import { Member } from '@/types/models'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface UserAvatarProps {
  member: Member
  className?: string
  positionForAvatar?: number
}

// Function of uploading profile image during registration doesn't provided at this moment
// Instead there is linear-gradient with first letters of username as user icon

const gradients = [
  'from-green-400 to-blue-500',
  'from-rose-400 to-indigo-500',
  'from-cyan-400 to-yellow-500',
  'from-yellow-400 to-pink-500',
  'from-teal-400 to-purple-500',
  'from-lime-400 to-fuchsia-500'
]

function getRandomGradient(position: number) {
  return gradients[position % gradients.length]
}

function UserAvatar({
  member,
  className,
  positionForAvatar = 0
}: UserAvatarProps) {
  return (
    <Avatar className={cn('h-7 w-7 md:h-10 md:w-10', className)}>
      <AvatarFallback
        className={`bg-gradient-to-r text-white ${getRandomGradient(
          positionForAvatar
        )}`}
      >
        {member.user.username.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}

export { UserAvatar }
