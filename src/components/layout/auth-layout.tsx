import React from 'react'

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen items-center justify-center bg-popover">
      <div className="m-4 w-full rounded-lg bg-background p-8 border dark:border-0 sm:max-w-md">
        {children}
      </div>
    </div>
  )
}

export { AuthLayout }
