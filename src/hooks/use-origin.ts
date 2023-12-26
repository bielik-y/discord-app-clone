import { useEffect, useState } from 'react'

// Origin is needed for generating invitation link
export const useOrigin = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : ''

  if (!isMounted) return ''
  return origin
}
