"use server";

import { returnValidationErrors } from "next-safe-action";
import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/supabase-utils/server";
import { getPostSchema } from "../schema";

export const getPost = actionClient
  .inputSchema(getPostSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const { postId } = parsedInput;

    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", postId)
      .single();

    if (error || !data) {
      return returnValidationErrors(getPostSchema, {
        _errors: ["Post not found or failed to fetch"]
      });
    }

    return { success: "Post fetched", post: data };
  });
