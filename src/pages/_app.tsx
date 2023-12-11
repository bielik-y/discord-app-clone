import '@/styles/globals.css'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import type { NextPage } from 'next'
import { RootLayout } from '@/components/layout/root-layout'
import { ModeToggle } from '@/components/mode-toggle'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { ModalProvider } from '@/components/providers/modal-provider'

// Logic for shared layouts in Page router (prevents layout rerenders)
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page)
  return getLayout(
    <RootLayout>
      <Head>
        <title>Chat App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Chat App takes the best Discord features and provides them to user in in a simplified and minimalist way"
        />
      </Head>
      <SessionProvider session={pageProps.session}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="chat-app-theme"
        >
          <Component {...pageProps} />
          <ModalProvider/>
          <ModeToggle />
        </ThemeProvider>
      </SessionProvider>
    </RootLayout>
  )
}
