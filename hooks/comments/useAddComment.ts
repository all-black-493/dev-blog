import { useState } from 'react'
import { addComment } from '@/lib/client-actions/comments/add-comment'

export function useAddComment(postId: string) {
  const [loading, setLoading] = useState(false)

  const submit = async (data: { author: string; content: string }) => {
    setLoading(true)
    const result = await addComment(postId, data)
    setLoading(false)
    return result
  }

  return { addComment: submit, loading }
}
