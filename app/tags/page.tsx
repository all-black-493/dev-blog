"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tag, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAllTags, getPostsByTag } from '@/lib/client-actions/blog-data';
import { gsap } from 'gsap';

export default function TagsPage() {
  const [allTags] = useState(getAllTags());

  useEffect(() => {
    // Animate tag cards
    gsap.fromTo('.tag-card',
      { opacity: 0, y: 20, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.7)"
      }
    );
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
          <Tag className="text-green-400" />
          All Tags
        </h1>
        <p className="text-gray-300">
          Explore posts by technology stack, architecture patterns, and development topics.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allTags.map((tag) => {
          const postsCount = getPostsByTag(tag).length;
          return (
            <Card
              key={tag}
              className="tag-card group bg-black/40 backdrop-blur-sm border-green-500/20 hover:border-green-400/40 transition-all cursor-pointer hover:scale-105"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className="bg-green-500/20 text-green-300 border-green-500/30"
                  >
                    {tag}
                  </Badge>
                  <ArrowRight
                    size={18}
                    className="text-gray-400 group-hover:text-green-400 transition-colors"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  {postsCount} {postsCount === 1 ? 'post' : 'posts'}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}