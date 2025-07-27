"use server";

import { returnValidationErrors } from "next-safe-action";
import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/supabase-utils/server";
import { addPostSchema } from "../schema";

export const createPost = actionClient
  .inputSchema(addPostSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return returnValidationErrors(addPostSchema, {
        _errors: ["Unauthorized"],
      });
    }

    const { error, data } = await supabase
      .from("blog_posts")
      .insert({
        ...parsedInput,
        author: user.id,
        created_at: new Date().toISOString(),
        status: "draft",
        read_time: 3,
      })
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    return { success: "Post created", post: data };
  });
