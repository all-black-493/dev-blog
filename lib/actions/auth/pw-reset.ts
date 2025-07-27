"use server";

import { createClient } from "@/supabase-utils/server";
import { actionClient } from "@/lib/safe-action";
import { returnValidationErrors } from "next-safe-action";
import { resetSchema } from "../schema";

export const sendPasswordReset = actionClient
  .inputSchema(resetSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(
      parsedInput.email,
      {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify`,
      }
    );

    if (error) {
      return returnValidationErrors(resetSchema, {
        _errors: [error.message],
      });
    }

    return { success: "Password reset email sent." };
  });
