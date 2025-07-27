"use server";

import { returnValidationErrors } from "next-safe-action";
import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/supabase-utils/server";
import { toggleFeaturedSchema } from "../schema";

export const toggleFeatured = actionClient
  .inputSchema(toggleFeaturedSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return returnValidationErrors(toggleFeaturedSchema, {
        _errors: ["Unauthorized"],
      });
    }

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || profile?.role !== "owner") {
      return returnValidationErrors(toggleFeaturedSchema, {
        _errors: ["Forbidden: Admins only"],
      });
    }

    const { error } = await supabase
      .from("blog_posts")
      .update({ featured: parsedInput.featured })
      .eq("id", parsedInput.postId);

    if (error) return { error: error.message };

    return {
      success: parsedInput.featured
        ? "Post marked as featured"
        : "Post unfeatured",
    };
  });
