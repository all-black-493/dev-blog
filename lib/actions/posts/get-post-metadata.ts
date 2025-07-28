"use server";

import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/supabase-utils/server";

export const getBlogPostsMetadata = actionClient.action(async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select(`
      id,
      title,
      created_at,
      summary,
      read_time,
      likes,
      dislikes,
      featured,
      status,
      profiles ( username ),
      blog_post_tags (
        tag:tags(name)
      ),
      blog_post_keywords (
        keyword:keywords(word)
      ),
      comments (
        id,
        content,
        created_at,
        author:profiles(username)

      )
    `)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return { formErrors: ["Failed to fetch blog metadata"] };
  }

  const metadata = data.map((post) => ({
    id: post.id,
    title: post.title,
    author: post.profiles?.username ?? "Unknown",
    date: post.created_at,
    summary: post.summary,
    readTime: post.read_time,
    likes: post.likes ?? 0,
    dislikes: post.dislikes ?? 0,
    featured: post.featured ?? false,
    status: post.status as "published" | "draft",
    tags: post.blog_post_tags?.map((t) => t.tag.name) ?? [],
    keywords: post.blog_post_keywords?.map((k) => k.keyword.word) ?? [],
    comments:
      post.comments?.map((c) => ({
        id: c.id,
        content: c.content,
        date: c.created_at,
        author: c.author,
      })) ?? [],
  }));

  return { metadata };
});
