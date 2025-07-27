"use server";

import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/supabase-utils/server";

import { getCommentsForPostSchema } from "../schema";

export const getCommentsForPost = actionClient
  .inputSchema(getCommentsForPostSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("blog_post_id", parsedInput.postId)
      .order("created_at", { ascending: false });

    if (error) {
      return { error: error.message };
    }

    return { success: "Comments fetched", comments: data };
  });
