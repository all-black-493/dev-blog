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
  comments: ThreadedComment[]
  featured: boolean
  status: 'published' | 'draft'
}

export interface CommentAuthor {
  id: string;
  username: string;
  avatar_url: string | null;
}

export interface ThreadedComment {
  id: string;
  author: string;
  content: string | null;
  created_at: string;
  likes: number | null;
  blog_post_id: string | null;
  parent_comment_id: string | null;
  profile: CommentAuthor;
  replies: ThreadedComment[];
}

