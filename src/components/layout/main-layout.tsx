import { NavSidebar } from '@/components/navbar/nav-sidebar'
import { MobileToggle } from '@/components/mobile-toggle'

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-popover dark:bg-neutral-800">
      <div className="hidden h-full w-20 flex-col md:flex">
        <NavSidebar />
      </div>
      <div className="h-full w-full">{children}</div>
    </div>
  )
}

export { MainLayout }
