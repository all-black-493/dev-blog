"use client";

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Tag, ThumbsUp, ThumbsDown, MessageCircle, Star } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BlogPost } from '@/lib/blog-data';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface BlogCardProps {
  post: BlogPost;
  index?: number;
}

export function BlogCard({ post, index = 0 }: BlogCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Initial animation
    gsap.fromTo(card, 
      { 
        opacity: 0, 
        y: 30,
        scale: 0.95
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: index * 0.1,
        ease: "power2.out"
      }
    );

    // Hover animations
    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -5,
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [index]);

  return (
    <Link href={`/blog/${post.id}`}>
      <Card 
        ref={cardRef}
        className="group bg-black/40 backdrop-blur-sm border-green-500/20 hover:border-green-400/40 transition-colors cursor-pointer relative"
      >
        {post.featured && (
          <div className="absolute top-3 right-3 z-10">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </div>
        )}
        
        <CardHeader>
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-semibold text-white group-hover:text-green-300 transition-colors line-clamp-2 pr-8">
              {post.title}
            </h3>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(post.date).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              {post.readTime} min read
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-gray-300 mb-4 line-clamp-3">
            {post.summary}
          </p>
          
          {/* Engagement Stats */}
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <ThumbsUp size={14} />
              {post.likes}
            </div>
            <div className="flex items-center gap-1">
              <ThumbsDown size={14} />
              {post.dislikes}
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle size={14} />
              {post.comments.length}
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <Tag size={14} className="text-green-400" />
            {post.tags.slice(0, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary"
                className={cn(
                  "bg-green-500/20 text-green-300 hover:bg-green-500/30 border-green-500/30",
                  "text-xs"
                )}
              >
                {tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-gray-400">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}