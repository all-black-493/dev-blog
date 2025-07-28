import { BlogCard } from './blog-card'
import { BlogPost } from '@/types/types'

type Props = {
  posts: BlogPost[]
  featuredPosts?: BlogPost[]
}

export function PostsList({ posts, featuredPosts }: Props) {
  if (posts.length === 0) {
    return <NoPostsFound />
  }

  return (
    <div className="space-y-6">
      {posts
        .filter(post => !featuredPosts?.includes(post))
        .map((post, index) => (
          <BlogCard key={post.id} post={post} index={index} />
        ))}
    </div>
  )
}

function NoPostsFound() {
  return (
    <div className="text-center py-12">
      <p className="text-gray-400 text-lg">
        No posts found matching your criteria.
      </p>
      <p className="text-gray-500 mt-2">
        Try adjusting your search or selected tags.
      </p>
    </div>
  )
}