import { useEffect, useState } from 'react'
import { fetchComments } from '@/lib/client-actions/comments/fetch-comments'

export function useFetchComments(postId: string) {
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await fetchComments(postId)
      if (data) setComments(data)
      setLoading(false)
    }

    load()
  }, [postId])

  return { comments, loading, error }
}
