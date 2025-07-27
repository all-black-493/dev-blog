"use server";

import { returnValidationErrors } from "next-safe-action";
import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/supabase-utils/server";
import { deletePostSchema } from "../schema";

export const deletePost = actionClient
  .inputSchema(deletePostSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return returnValidationErrors(deletePostSchema, {
        _errors: ["Unauthorized"],
      });
    }

    const { postId } = parsedInput;

    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", postId)
      .eq("author", user.id);

    if (error) {
      return { error: error.message };
    }

    return { success: "Post deleted" };
  });
