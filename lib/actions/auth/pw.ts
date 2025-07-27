"use server";

import { actionClient } from "@/lib/safe-action";
import { returnValidationErrors } from "next-safe-action";
import { createClient } from "@/supabase-utils/server";
import { pwloginSchema } from "../schema";

export const loginUser = actionClient
  .inputSchema(pwloginSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: parsedInput.email,
      password: parsedInput.password,
    });

    if (error) {
      return returnValidationErrors(pwloginSchema, {
        _errors: [error.message],
      });
    }

    return { success: "Logged in successfully." };
  });
