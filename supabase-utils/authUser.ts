"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/supabase-utils/browser";

export function useAuthUser() {
  const [user, setUser] = useState<null | { id: string; email?: string }>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data, error }) => {
      if (!error && data?.user) {
        setUser({ id: data.user.id, email: data.user.email });
        console.log("User data in auth user file:", data)
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser({ id: session.user.id, email: session.user.email });
      }

      if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return user;
}
