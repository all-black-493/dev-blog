"use server";

import { returnValidationErrors } from "next-safe-action";
import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/supabase-utils/server";
import { createCommentReplySchema } from "../schema";

export const createCommentReply = actionClient
    .inputSchema(createCommentReplySchema)
    .action(async ({ parsedInput }) => {
        const supabase = await createClient();

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return returnValidationErrors(createCommentReplySchema, {
                _errors: ["Unauthorized"],
            });
        }

        const { data, error } = await supabase
            .from("comments")
            .insert({
                author: user.id,
                blog_post_id: parsedInput.postId,
                parent_comment_id: parsedInput.parentCommentId,
                content: parsedInput.content,
                created_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            return { error: error.message };
        }

        return { success: "Reply posted", comment: data };
    });
