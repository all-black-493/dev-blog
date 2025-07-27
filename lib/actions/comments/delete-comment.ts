"use server";

import { returnValidationErrors } from "next-safe-action";
import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/supabase-utils/server";
import { deleteCommentSchema } from "../schema";

export const deleteComment = actionClient
  .inputSchema(deleteCommentSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return returnValidationErrors(deleteCommentSchema, {
        _errors: ["Unauthorized"],
      });
    }

    const { data: comment, error: fetchError } = await supabase
      .from("comments")
      .select("author")
      .eq("id", parsedInput.commentId)
      .single();

    if (fetchError || !comment || comment.author !== user.id) {
      return returnValidationErrors(deleteCommentSchema, {
        _errors: ["You are not allowed to delete this comment"],
      });
    }

    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", parsedInput.commentId);

    if (error) {
      return { error: error.message };
    }

    return { success: "Comment deleted" };
  });
