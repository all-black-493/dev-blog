// components/logout-button.tsx

"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/supabase-utils/browser";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh(); 
  };

  return (
    <Button
      variant="outline"
      className="absolute top-4 right-4 z-20"
      onClick={handleLogout}
    >
      Log out
    </Button>
  );
}
