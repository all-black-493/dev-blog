import { useState } from 'react'
import { deleteComment } from '@/lib/client-actions/comments/delete-comment'

export function useDeleteComment() {
  const [loading, setLoading] = useState(false)

  const remove = async (commentId: string) => {
    setLoading(true)
    const result = await deleteComment(commentId)
    setLoading(false)
    return result
  }

  return { deleteComment: remove, loading }
}
