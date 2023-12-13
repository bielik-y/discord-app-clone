import { NavSidebar } from '@/components/navbar/nav-sidebar'

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-popover dark:bg-neutral-800">
      <div className="z-30 hidden h-full w-20 flex-col sm:flex">
        <NavSidebar />
      </div>
      <div className="h-full w-full">{children}</div>
    </div>
  )
}

export { MainLayout }
