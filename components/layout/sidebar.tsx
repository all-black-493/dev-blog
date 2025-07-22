"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Tag, User, Menu, X, Code, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Tags', href: '/tags', icon: Tag },
  { name: 'Create Post', href: '/admin/create', icon: PlusCircle },
  { name: 'About', href: '/about', icon: User },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo('.sidebar-content', 
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [isOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden bg-black/20 backdrop-blur-sm border border-green-500/20"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-full w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="sidebar-content h-full bg-black/40 backdrop-blur-xl border-r border-green-500/20">
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 shrink-0 items-center px-6 border-b border-green-500/20">
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Code className="text-green-400" size={24} />
                <span className="text-green-400">Dev</span>Blog
              </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 px-4 py-6">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-green-500/10 hover:text-green-300",
                      isActive 
                        ? "bg-green-500/20 text-green-300 border border-green-500/30" 
                        : "text-gray-300"
                    )}
                  >
                    <item.icon size={18} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-green-500/20">
              <p className="text-xs text-gray-400">
                © 2025 DevBlog. 3+ years of developer experience.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}