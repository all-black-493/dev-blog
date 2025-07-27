export interface BlogPost {
  id: string
  title: string
  author: string
  date: string
  summary: string
  content?: string
  readTime: number
  likes: number
  dislikes: number
  tags: { id: number; name: string }[]
  keywords: string[]
  comments: Comment[]
  featured: boolean
  status: 'published' | 'draft'
}

export interface Comment {
  id: string
  author: string
  content: string | null
  date: string
  likes?: number | null
}