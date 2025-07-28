"use client";

import { useEffect } from "react";
import { useAction } from "next-safe-action/hooks";
import { getFeaturedPosts } from "@/lib/actions/posts/get-featured-posts";
import { BlogCard } from "./blog-card";
import { BlogPost } from "@/types/types";

type Props = {
  featuredPosts: BlogPost[];
  showAllPostsHeader: boolean;
};

export function FeaturedPosts({ showAllPostsHeader }: Props) {
  const {
    execute,
    result: featuredPosts,
    status,
  } = useAction(getFeaturedPosts);

  useEffect(() => {
    execute({}); 
  }, [execute]);

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
        <span className="text-green-400">★</span>
        Featured Posts
      </h2>

      <div className="space-y-6">
        {status === "executing" && <p className="text-white">Loading...</p>}
        {status === "hasErrored" && (
          <p className="text-red-500">Error loading featured posts</p>
        )}
        {status === "hasSucceeded" &&
          featuredPosts.data?.map((post: BlogPost, index: number) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
      </div>

      {showAllPostsHeader && (
        <div className="border-t border-green-500/20 mt-12 pt-8">
          <h2 className="text-2xl font-semibold text-white mb-6">All Posts</h2>
        </div>
      )}
    </div>
  );
}
