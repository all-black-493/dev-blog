import { useState } from 'react'
import { updateComment } from '@/lib/client-actions/comments/update-comment'

export function useUpdateComment() {
  const [loading, setLoading] = useState(false)

  const update = async (commentId: string, content: string) => {
    setLoading(true)
    const result = await updateComment(commentId, content)
    setLoading(false)
    return result
  }

  return { updateComment: update, loading }
}
