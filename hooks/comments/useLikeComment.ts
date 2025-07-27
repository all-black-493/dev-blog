import { useState } from 'react'
import { likeComment } from '@/lib/client-actions/comments/like-comment'

export function useLikeComment() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleLike = async (commentId: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await likeComment(commentId)
      return result
    } catch (err: any) {
      console.error('useLikeComment error:', err)
      setError('Failed to toggle like')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { toggleLike, loading, error }
}
