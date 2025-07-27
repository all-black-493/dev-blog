"use server";

import { returnValidationErrors } from "next-safe-action";
import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/supabase-utils/server";
import { dislikePostSchema } from "../schema";

export const dislikePost = actionClient
  .inputSchema(dislikePostSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return returnValidationErrors(dislikePostSchema, {
        _errors: ["Unauthorized"],
      });
    }

    const { error } = await supabase.rpc("dislike_post", {
      post_id: parsedInput.postId,
    });

    if (error) return { error: error.message };

    return { success: "Post disliked" };
  });
