"use server";

import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/supabase-utils/server";

export const getMyComments = actionClient.action(async () => {
    const supabase = await createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return { error: "Unauthorized" };
    }

    const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("author", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        return { error: error.message };
    }

    return { success: "User comments fetched", comments: data };
});
