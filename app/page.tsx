"use client";

import { useState, useEffect } from 'react';
import { BlogCard } from '@/components/blog/blog-card';
import { TagSelector } from '@/components/blog/tag-selector';
import { blogPostsMetadata, searchPosts, getPostsByTag, getFeaturedPosts } from '@/lib/blog-data';
import { gsap } from 'gsap';

export default function Home() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(blogPostsMetadata);
  const [featuredPosts, setFeaturedPosts] = useState(getFeaturedPosts());

  useEffect(() => {
    // Animate page header
    gsap.fromTo('.page-header',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  useEffect(() => {
    let posts = blogPostsMetadata;

    // Apply search filter
    if (searchQuery) {
      posts = searchPosts(searchQuery);
    }

    // Apply tag filters
    if (selectedTags.length > 0) {
      posts = posts.filter(post => 
        selectedTags.some(tag => 
          post.tags.some(postTag => 
            postTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
      );
    }

    setFilteredPosts(posts);
  }, [selectedTags, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <header className="page-header mb-12">
        <h1 className="text-5xl font-bold text-white mb-4 flex items-center gap-4">
          <span className="text-green-400">Dev</span>Blog
          <span className="text-sm bg-green-500/20 text-green-300 px-3 py-1 rounded-full">
            3+ Years Experience
          </span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl">
          Production-tested insights from architecting and scaling systems that serve millions of users. 
          Real-world solutions, battle-tested patterns, and hard-earned lessons from the trenches.
        </p>
      </header>
      
      {/* Featured Posts */}
      {featuredPosts.length > 0 && !searchQuery && selectedTags.length === 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <span className="text-green-400">★</span>
            Featured Posts
          </h2>
          <div className="space-y-6">
            {featuredPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
          <div className="border-t border-green-500/20 mt-12 pt-8">
            <h2 className="text-2xl font-semibold text-white mb-6">All Posts</h2>
          </div>
        </div>
      )}

      {/* Filters */}
      <TagSelector
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Blog Posts */}
      <div className="space-y-6">
        {filteredPosts.length > 0 ? (
          filteredPosts
            .filter(post => !(featuredPosts.includes(post) && !searchQuery && selectedTags.length === 0))
            .map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No posts found matching your criteria.
            </p>
            <p className="text-gray-500 mt-2">
              Try adjusting your search or selected tags.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}