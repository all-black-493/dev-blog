"use server";

import { returnValidationErrors } from "next-safe-action";
import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/supabase-utils/server";
import { likePostSchema } from "../schema";

export const likePost = actionClient
  .inputSchema(likePostSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return returnValidationErrors(likePostSchema, {
        _errors: ["Unauthorized"],
      });
    }

    const { error } = await supabase.rpc("like_post", {
      post_id: parsedInput.postId,
    });

    if (error) return { error: error.message };

    return { success: "Post liked" };
  });
