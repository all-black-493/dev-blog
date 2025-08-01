"use server";

import { returnValidationErrors } from "next-safe-action";
import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/supabase-utils/server";
import { addCommentSchema } from "../schema";

export const addComment = actionClient
  .inputSchema(addCommentSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return returnValidationErrors(addCommentSchema, {
        _errors: ["Unauthorized"],
      });
    }

    const { error, data } = await supabase
      .from("comments")
      .insert({
        blog_post_id: parsedInput.postId,
        content: parsedInput.content,
        author: user.id,
        created_at: new Date().toISOString(),
        parent_comment_id: parsedInput.parentCommentId ?? null,
      })
      .select(`
    id,
    content,
    created_at,
    likes,
    author,
    profile:author (
      id,
      username,
      avatar_url
    ),
    parent_comment_id(id),
    blog_post_id
  `)
      .single();


    if (error) return { error: error.message };

    return { success: "Comment added", comment: data };
  });
