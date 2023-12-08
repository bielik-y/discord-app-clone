import React from 'react'

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="m-4 w-full rounded-lg bg-white p-8 sm:max-w-md sm:shadow-sm">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
