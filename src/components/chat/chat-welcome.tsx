import { Hash } from 'lucide-react'

interface ChatWelcomeProps {
  name: string
  type: 'channel' | 'conversation'
}

function ChatWelcome({ name, type }: ChatWelcomeProps) {
  return (
    <div className="mb-4 space-y-2 px-4">
      {type === 'channel' && (
        <div className="dark:bg-neutral-700 flex h-[75px] w-[75px] items-center justify-center rounded-full bg-neutral-400">
          <Hash className="h-12 w-12 text-white dark:text-neutral-200" />
        </div>
      )}
      <p className='text-xl md:text-3xl font-bold'>
        {type === 'channel' ? "Welcome to #" : "User "}{name}
      </p>
      <p className='text-zinc-600 dark:text-zinc-400 text-sm'>{type === 'channel' ? `This is the start of the #${name} channel.` : `This is the start of your conversation with ${name}`}</p>
    </div>
  )
}

export { ChatWelcome }
