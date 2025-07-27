"use server";

import { createClient } from "@/supabase-utils/server";

export const logoutUser = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
};
