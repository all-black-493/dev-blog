"use server";

import { returnValidationErrors } from "next-safe-action";
import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/supabase-utils/server";
import { editPostSchema } from "../schema";

export const editPost = actionClient
  .inputSchema(editPostSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return returnValidationErrors(editPostSchema, {
        _errors: ["Unauthorized"],
      });
    }

    const { postId, ...updateFields } = parsedInput;

    const { error, data } = await supabase
      .from("blog_posts")
      .update({ ...updateFields, updated_at: new Date().toISOString() })
      .eq("id", postId)
      .eq("author", user.id)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    return { success: "Post updated", post: data };
  });
