import React, { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

/**
 * QueryProvider Component
 *
 * Wraps application with TanStack Query (React Query) client
 * Provides server state management, caching, and loading states
 *
 * Configuration:
 * - refetchOnWindowFocus: false (prevents refetch on window focus)
 * - retry: 1 (retry failed requests once)
 * - staleTime: 5 minutes (data considered fresh for 5 minutes)
 */

// Create query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
