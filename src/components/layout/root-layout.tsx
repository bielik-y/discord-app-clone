import { Figtree } from 'next/font/google'
const font = Figtree({ subsets: ['latin'] })

// Root layout for all pages
function RootLayout({ children }: { children: React.ReactNode }) {
  return <div className={font.className}>{children}</div>
}

export { RootLayout }
