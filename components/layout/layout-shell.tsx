"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { Sidebar } from "./sidebar";
import { AnimatedBackground } from "./animated-background";
import { useAuthUser } from "@/supabase-utils/authUser";
import { LogoutButton } from "../auth/logout-button";


interface LayoutShellProps {
  children: React.ReactNode;
}

export function LayoutShell({ children }: LayoutShellProps) {
  const pathname = usePathname();
  const user = useAuthUser();
  const isAuthPage = pathname.startsWith("/auth");

  useEffect(() => {
    gsap.fromTo(
      ".page-content",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatedBackground />

      {!isAuthPage && <Sidebar />}
      {user && <LogoutButton />}

      <main className={!isAuthPage ? "md:ml-64 relative z-10" : "relative z-10"}>
        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}
