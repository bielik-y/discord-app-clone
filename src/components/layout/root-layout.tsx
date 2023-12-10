import { Figtree } from 'next/font/google'
const font = Figtree({ subsets: ['latin'] })

// Root layout for all pages
function RootLayout({ children }: { children: React.ReactNode }) {
  return <main className={font.className}>{children}</main>
}

export { RootLayout }
