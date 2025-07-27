"use server";

import { returnValidationErrors } from "next-safe-action";
import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/supabase-utils/server";
import { editCommentSchema } from "../schema";

export const editComment = actionClient
  .inputSchema(editCommentSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return returnValidationErrors(editCommentSchema, {
        _errors: ["Unauthorized"],
      });
    }

    const { data: comment, error: fetchError } = await supabase
      .from("comments")
      .select("author")
      .eq("id", parsedInput.commentId)
      .single();

    if (fetchError || !comment || comment.author !== user.id) {
      return returnValidationErrors(editCommentSchema, {
        _errors: ["You are not allowed to edit this comment"],
      });
    }

    const { error, data: updated } = await supabase
      .from("comments")
      .update({ content: parsedInput.content })
      .eq("id", parsedInput.commentId)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    return { success: "Comment updated", comment: updated };
  });
