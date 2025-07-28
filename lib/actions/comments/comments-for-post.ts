"use server";

import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/supabase-utils/server";
import { getCommentsForPostSchema } from "../schema";
import { ThreadedComment } from "@/types/types";

export const getCommentsForPost = actionClient
  .inputSchema(getCommentsForPostSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("comments")
      .select(`
        id,
        blog_post_id,
        author,
        content,
        created_at,
        parent_comment_id,
        likes,
        author (
          id,
          username,
          avatar_url
        )
      `)
      .eq("blog_post_id", parsedInput.postId)
      .order("created_at", { ascending: true });

    if (error) {
      return { error: error.message };
    }

    const commentMap = new Map<string, ThreadedComment>();

    for (const raw of data) {
      const comment: ThreadedComment = {
        id: raw.id,
        blog_post_id: raw.blog_post_id,
        author: raw.author,
        content: raw.content,
        created_at: raw.created_at,
        parent_comment_id: raw.parent_comment_id,
        likes: raw.likes ?? 0,
        profile: {
          id: raw.author.id,
          username: raw.author.username,
          avatar_url: raw.author.avatar_url,
        },
        replies: [],
      };

      commentMap.set(comment.id, comment);
    }

    const topLevelComments: ThreadedComment[] = [];

    for (const comment of Array.from(commentMap.values())) {
      if (comment.parent_comment_id) {
        const parent = commentMap.get(comment.parent_comment_id);
        if (parent) {
          parent.replies.push(comment);
        } else {
          topLevelComments.push(comment);
        }
      } else {
        topLevelComments.push(comment);
      }
    }

    return { success: "Comments fetched", comments: topLevelComments };
  });
