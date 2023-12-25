import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Using function as state ensures that data is not shared 
  // between different users and requests
  const [queryClient] = useState(() => new QueryClient)

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
