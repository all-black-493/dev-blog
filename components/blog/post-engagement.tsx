"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogPost } from "@/types/types";
import { cn } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { likePost } from "@/lib/actions/posts/like-post";
import { dislikePost } from "@/lib/actions/posts/dislike-post";

interface PostEngagementProps {
  post: BlogPost;
}

export function PostEngagement({ post }: PostEngagementProps) {
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.dislikes);
  const [userAction, setUserAction] = useState<"like" | "dislike" | null>(null);

  const { execute: likePostExecute, status: likeStatus } = useAction(likePost, {
    onSuccess: (res) => {
      if ("error" in res || "_errors" in res) {
        setLikes((prev) => prev - 1);
        setUserAction(null);
        console.error("Failed to like post:", res);
      }
    },
  });

  const { execute: dislikePostExecute, status: dislikeStatus } = useAction(dislikePost, {
    onSuccess: (res) => {
      if ("error" in res || "_errors" in res) {
        setDislikes((prev) => prev - 1);
        setUserAction(null);
        console.error("Failed to dislike post:", res);
      }
    },
  });

  const handleLike = () => {
    if (userAction === "like" || likeStatus === "executing") return;

    if (userAction === "dislike") {
      setDislikes((prev) => prev - 1);
    }

    setLikes((prev) => prev + 1);
    setUserAction("like");

    likePostExecute({ postId: post.id });
  };

  const handleDislike = () => {
    if (userAction === "dislike" || dislikeStatus === "executing") return;

    if (userAction === "like") {
      setLikes((prev) => prev - 1);
    }

    setDislikes((prev) => prev + 1);
    setUserAction("dislike");

    dislikePostExecute({ postId: post.id });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.summary,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch (err) {
      console.error("Share failed", err);
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
            disabled={likeStatus === "executing"}
            className={cn(
              "flex items-center gap-2 hover:bg-green-500/10",
              userAction === "like" && "text-green-400 bg-green-500/20"
            )}
          >
            <ThumbsUp size={18} />
            {likes}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDislike}
            disabled={dislikeStatus === "executing"}
            className={cn(
              "flex items-center gap-2 hover:bg-red-500/10",
              userAction === "dislike" && "text-red-400 bg-red-500/20"
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
