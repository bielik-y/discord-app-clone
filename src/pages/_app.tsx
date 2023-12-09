import '@/styles/globals.css'
import { RootLayout } from '@/components/layout/root-layout'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
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
        </ThemeProvider>
      </SessionProvider>
    </RootLayout>
  )
}
