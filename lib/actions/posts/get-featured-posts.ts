"use server";

import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/supabase-utils/server";
import { BlogPost } from "@/types/types";
import z from "zod";

const inputSchema = z.object({});

export const getFeaturedPosts = actionClient
    .inputSchema(inputSchema)
    .action<BlogPost[]>(async () => {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("blog_posts")
            .select(`
        id,
        title,
        created_at,
        summary,
        content,
        read_time,
        likes,
        dislikes,
        featured,
        status,
        profiles (
          username
        ),
        blog_post_tags (
          tags (
            id,
            name
          )
        ),
        blog_post_keywords (
          keywords(
          id,
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
      `)
            .eq("featured", true)
            .eq("status", "published")
            .order("created_at", { ascending: false })
            .limit(5);

        if (error || !data) {
            console.error("Error fetching featured posts:", error?.message);
            return [];
        }

        const transformed: BlogPost[] = data.map((post) => ({
            id: post.id,
            title: post.title,
            author: post.profiles?.username,
            date: post.created_at,
            summary: post.summary,
            content: post.content ?? undefined,
            readTime: post.read_time,
            likes: post.likes ?? 0,
            dislikes: post.dislikes ?? 0,
            featured: post.featured ?? false,
            status: post.status as "published" | "draft",
            tags:
                post.blog_post_tags?.map((tagJoin) => tagJoin.tags) ?? [],
            keywords: post.blog_post_keywords?.map((k) => k.keywords.word) ?? [],

            comments:
                post.comments?.map((c) => ({
                    id: c.id,
                    author: c.author,
                    content: c.content,
                    date: c.created_at,
                    likes: c.likes ?? 0,
                })) ?? [],
        }));

        return transformed;
    });
