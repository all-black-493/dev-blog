"use client";

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogPost, likePost, dislikePost } from '@/lib/client-actions/blog-data';
import { cn } from '@/lib/utils';

interface PostEngagementProps {
  post: BlogPost;
}

export function PostEngagement({ post }: PostEngagementProps) {
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.dislikes);
  const [userAction, setUserAction] = useState<'like' | 'dislike' | null>(null);

  const handleLike = async () => {
    if (userAction === 'like') return;

    if (userAction === 'dislike') {
      setDislikes(prev => prev - 1);
    }

    setLikes(prev => prev + 1);
    setUserAction('like');
    await likePost(post.id);
  };

  const handleDislike = async () => {
    if (userAction === 'dislike') return;

    if (userAction === 'like') {
      setLikes(prev => prev - 1);
    }

    setDislikes(prev => prev + 1);
    setUserAction('dislike');
    await dislikePost(post.id);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: post.title,
        text: post.summary,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  return (
    <div className="border-t border-green-500/20 pt-8 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={cn(
              "flex items-center gap-2 hover:bg-green-500/10",
              userAction === 'like' && "text-green-400 bg-green-500/20"
            )}
          >
            <ThumbsUp size={18} />
            {likes}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDislike}
            className={cn(
              "flex items-center gap-2 hover:bg-red-500/10",
              userAction === 'dislike' && "text-red-400 bg-red-500/20"
            )}
          >
            <ThumbsDown size={18} />
            {dislikes}
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="flex items-center gap-2 hover:bg-green-500/10"
        >
          <Share2 size={18} />
          Share
        </Button>
      </div>
    </div>
  );
}