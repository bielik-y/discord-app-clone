import axios from 'axios'
import qs from 'query-string'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useSocket } from '@/components/providers/socket-provider'

interface ChatQueryProps {
  serverId: string
  queryKey: string
  apiUrl: string
  paramKey: 'channelId' | 'conversationId'
  paramValue: string
}

export const useChatQuery = ({
  serverId,
  queryKey,
  apiUrl,
  paramKey,
  paramValue
}: ChatQueryProps) => {
  const { isConnected } = useSocket()

  async function fetchMessages({ pageParam = undefined }) {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          serverId,
          cursor: pageParam,
          [paramKey]: paramValue
        }
      },
      { skipNull: true }
    )

    return await axios.get(url)
  }

  // Includes fallback pooling every 1s
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery<any, any>({
      queryKey: [queryKey],
      queryFn: () => fetchMessages({ pageParam: undefined }),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchInterval: isConnected ? false : 1000,
      initialPageParam: undefined
    })

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  }
}
