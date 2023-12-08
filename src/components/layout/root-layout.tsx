import { Figtree } from 'next/font/google'

const font = Figtree({ subsets: ['latin'] })

// root layout for all pages

function Layout({ children }: { children: React.ReactNode }) {
  return <main className={font.className}>{children}</main>
}

export default Layout
