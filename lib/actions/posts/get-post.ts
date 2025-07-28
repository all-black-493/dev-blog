// lib/actions/posts/get-post.ts
"use server";

import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/supabase-utils/server";
import { getPostSchema } from "@/lib/actions/schema";
import { returnValidationErrors } from "next-safe-action";

export const getPost = actionClient
  .inputSchema(getPostSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();
    const { postId } = parsedInput;

    const { data: post, error } = await supabase
      .from("blog_posts")
      .select(
        `
          id,
          title,
          summary,
          content,
          created_at,
          read_time,
          likes,
          dislikes,
          featured,
          status,
          profiles (
            username,
            email
          ),
          blog_post_tags (
            tags (
              id,
              name
            )
          ),
          blog_post_keywords (
            keywords (
              word
            )
          ),
          comments (
            id,
            author,
            content,
            created_at,
            likes
          )
        `
      )
      .eq("id", postId)
      .eq("status", "published") // ✅ Ensure it's published
      .single();

    if (error || !post) {
      return returnValidationErrors(getPostSchema, {
        _errors: ["Post not found or failed to fetch"]
      });
    }

    const mappedPost = {
      id: post.id,
      title: post.title,
      author: post.profiles.username,
      summary: post.summary,
      content: post.content ?? undefined,
      date: post.created_at,
      readTime: post.read_time,
      likes: post.likes ?? 0,
      dislikes: post.dislikes ?? 0,
      featured: post.featured ?? false,
      status: post.status as "published" | "draft",
      tags: post.blog_post_tags.map((t) => t.tags),
      keywords: post.blog_post_keywords.map((k) => k.keywords.word),
      comments: post.comments.map((c) => ({
        id: c.id,
        author: c.author,
        content: c.content,
        date: c.created_at,
        likes: c.likes ?? 0,
      }))
    };

    return { success: "Post fetched successfully", post: mappedPost };
  });
