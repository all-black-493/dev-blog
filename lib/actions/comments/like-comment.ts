"use server";

import { returnValidationErrors } from "next-safe-action";
import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/supabase-utils/server";
import { likeCommentSchema } from "../schema";

export const likeComment = actionClient
    .inputSchema(likeCommentSchema)
    .action(async ({ parsedInput }) => {
        const supabase = await createClient();

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return returnValidationErrors(likeCommentSchema, {
                _errors: ["Unauthorized"],
            });
        }

        const { data: existingLike, error: fetchError } = await supabase
            .from("comment_likes")
            .select("comment_id")
            .eq("comment_id", parsedInput.commentId)
            .eq("liker_id", user.id)
            .maybeSingle();

        if (fetchError) {
            return { error: fetchError.message };
        }

        if (existingLike) {
            const { error: unlikeError } = await supabase
                .from("comment_likes")
                .delete()
                .eq("comment_id", parsedInput.commentId)
                .eq("liker_id", user.id);

            if (unlikeError) {
                return { error: unlikeError.message };
            }

            return { success: "Comment un-liked" };
        }

        const { error } = await supabase.from("comment_likes")
            .insert({
                comment_id: parsedInput.commentId,
                liker_id: user.id,
            });

        if (error) {
            return { error: error.message };
        }

        return { success: "Comment liked" };
    });
