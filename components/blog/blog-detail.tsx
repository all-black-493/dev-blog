"use client";

import { useEffect, useRef } from 'react';
import { Calendar, Clock, Tag, ArrowLeft, ThumbsUp, ThumbsDown, MessageCircle, Edit } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CommentSection } from './comment-section';
import { PostEngagement } from './post-engagement';
import { BlogPost } from '@/lib/blog-data';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';
import 'highlight.js/styles/github-dark.css';

interface BlogDetailProps {
  post: BlogPost;
}

export function BlogDetail({ post }: BlogDetailProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    // Animate content sections
    const sections = content.querySelectorAll('h1, h2, h3, p, pre, ul, ol');
    
    gsap.fromTo(sections,
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6,
        stagger: 0.05,
        ease: "power2.out",
        delay: 0.2
      }
    );
  }, []);

  return (
    <article className="max-w-4xl mx-auto px-6 py-8">
      {/* Back Button */}
      <Button
        asChild
        variant="ghost"
        className="mb-8 text-gray-300 hover:text-white hover:bg-green-500/10"
      >
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft size={18} />
          Back to posts
        </Link>
      </Button>
      
      {/* Admin Actions */}
      <div className="flex justify-end mb-4">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="border-green-500/30 text-green-300 hover:bg-green-500/10"
        >
          <Link href={`/admin/edit/${post.id}`} className="flex items-center gap-2">
            <Edit size={16} />
            Edit Post
          </Link>
        </Button>
      </div>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
          {post.title}
        </h1>
        
        <div className="flex items-center gap-6 text-gray-300 mb-6">
          <span className="flex items-center gap-2">
            <Calendar size={16} />
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          <span className="flex items-center gap-2">
            <Clock size={16} />
            {post.readTime} min read
          </span>
          <span>by {post.author}</span>
        </div>

        {/* Tags */}
        <div className="flex items-center flex-wrap gap-2 mb-8">
          <Tag size={16} className="text-green-400" />
          {post.tags.map((tag) => (
            <Badge 
              key={tag}
              variant="secondary"
              className="bg-green-500/20 text-green-300 hover:bg-green-500/30 border-green-500/30"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </header>

      {/* Content */}
      <div 
        ref={contentRef}
        className="prose prose-invert prose-purple max-w-none"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold text-white mb-6 mt-8">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-medium text-white mb-3 mt-6">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-gray-300 mb-4 leading-relaxed">
                {children}
              </p>
            ),
            code: ({ inline, className, children }) => {
              if (inline) {
                return (
                  <code className="bg-green-900/30 text-green-300 px-2 py-1 rounded text-sm">
                    {children}
                  </code>
                );
              }
              return (
                <code className={cn("block", className)}>
                  {children}
                </code>
              );
            },
            pre: ({ children }) => (
              <pre className="bg-gray-900 border border-green-500/20 rounded-lg p-4 overflow-x-auto mb-6">
                {children}
              </pre>
            ),
            ul: ({ children }) => (
              <ul className="text-gray-300 mb-4 ml-6 space-y-2">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="text-gray-300 mb-4 ml-6 space-y-2">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="list-disc">
                {children}
              </li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-green-500 pl-4 italic text-gray-300 mb-4">
                {children}
              </blockquote>
            ),
            strong: ({ children }) => (
              <strong className="text-white font-semibold">
                {children}
              </strong>
            ),
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
      
      {/* Engagement Section */}
      <PostEngagement post={post} />
      
      {/* Comments Section */}
      <CommentSection post={post} />
    </article>
  );
}