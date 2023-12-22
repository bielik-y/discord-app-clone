import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NavSidebar } from '@/components/navbar/nav-sidebar'
import { ServerSidebar } from '@/components/server/server-sidebar'
import { useServerStore } from '@/hooks/use-server-store'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

function MobileToggle() {
  const { server } = useServerStore()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="absolute top-1 md:hidden"
          size="icon"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex gap-0 p-0">
        <div className="w-20">
          <NavSidebar />
        </div>
        {server && <ServerSidebar server={server} />}
      </SheetContent>
    </Sheet>
  )
}

export { MobileToggle }
