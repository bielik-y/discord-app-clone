import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    // Suppressing hydration warnings is needed for theme provider
    <Html lang="en" suppressHydrationWarning>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
