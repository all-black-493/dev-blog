"use client";

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { Sidebar } from './sidebar';
import { AnimatedBackground } from './animated-background';

interface LayoutShellProps {
  children: React.ReactNode;
}

export function LayoutShell({ children }: LayoutShellProps) {
  useEffect(() => {
    // Page enter animation
    gsap.fromTo('.page-content', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatedBackground />
      <Sidebar />
      
      <main className="md:ml-64 relative z-10">
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
}