"use client"
import { useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { BlogHeader } from '@/components/blog/blog-header'
import { FeaturedPosts } from '@/components/blog/featured-posts'
import { BlogFilters } from '@/components/blog/blog-filters'
import { PostsList } from '@/components/blog/posts-list'
import { BlogPost } from '@/types/types'

type Props = {
  allPosts?: BlogPost[]
  featuredPosts?: BlogPost[]
}

export default function BlogClientPage({ allPosts, featuredPosts }: Props) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(allPosts ?? [])

  useEffect(() => {
    gsap.fromTo(
      '.page-header',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    )
  }, [])

  useEffect(() => {
    let posts = [...(allPosts ?? [])]

    if (searchQuery) {
      posts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedTags.length > 0) {
      posts = posts.filter((post) =>
        selectedTags.some((tag) =>
          post.tags?.some((postTag) =>
            postTag.name.toLowerCase().includes(tag.toLowerCase())
          )
        )
      )
    }

    setFilteredPosts(posts)
  }, [searchQuery, selectedTags, allPosts])

  const showFeatured = (featuredPosts?.length ?? 0) > 0 && !searchQuery && selectedTags.length === 0

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <BlogHeader />
      
      {showFeatured && featuredPosts && (
        <FeaturedPosts 
          featuredPosts={featuredPosts} 
          showAllPostsHeader={filteredPosts.length > 0}
        />
      )}

      <BlogFilters
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <PostsList 
        posts={filteredPosts} 
        featuredPosts={showFeatured ? featuredPosts ?? [] : []}
      />
    </div>
  )
}