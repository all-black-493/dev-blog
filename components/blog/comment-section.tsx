"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Send, User, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BlogPost, ThreadedComment } from "@/types/types";
import { useAction } from "next-safe-action/hooks";
import { addComment } from "@/lib/actions/comments/add-comment";
import { getCommentsForPost } from "@/lib/actions/comments/comments-for-post";
import { likeComment } from "@/lib/actions/comments/like-comment";
import { formatDistanceToNow } from "date-fns";
import { useAuthUser } from "@/supabase-utils/authUser";
import { createClient as createBrowserClient } from "@/supabase-utils/browser";
import { createCommentReply } from "@/lib/actions/comments/reply-comment";

interface CommentSectionProps {
  post: BlogPost;
}

export function CommentSection({ post }: CommentSectionProps) {
  const user = useAuthUser();
  const supabase = createBrowserClient();
  const [comments, setComments] = useState<ThreadedComment[]>([]);
  const [content, setContent] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchComments = useAction(getCommentsForPost, {
    onSuccess: (res) => {
      if (res.data?.success && res.data.comments) {
        setComments(res.data.comments);
      }
      setLoading(false);
    },
    onError: () => {
      setErrorMessage("Failed to load comments.");
      setLoading(false);
    },
  });

  useEffect(() => {
    fetchComments.execute({ postId: post.id });
  }, [post.id]);

  useEffect(() => {
    const channel = supabase
      .channel(`comments-post-${post.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `blog_post_id=eq.${post.id}`,
        },
        ({ new: c }) => {
          const formatted: ThreadedComment = {
            id: c.id,
            author: c.author,
            content: c.content,
            created_at: c.created_at,
            likes: c.likes,
            blog_post_id: c.blog_post_id,
            parent_comment_id: c.parent_comment_id,
            profile: {
              id: c.author.id,
              username: c.author.username,
              avatar_url: c.author.avatar_url,
            },
            replies: [],
          };
          setComments((prev) =>
            c.parent_comment_id
              ? prev.map((pc) =>
                pc.id === c.parent_comment_id
                  ? { ...pc, replies: [...pc.replies, formatted] }
                  : pc
              )
              : [formatted, ...prev]
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "comments",
          filter: `blog_post_id=eq.${post.id}`,
        },
        ({ new: c }) => {
          setComments((prev) =>
            prev.map((pc) =>
              pc.id === c.id
                ? { ...pc, content: c.content, likes: c.likes }
                : {
                  ...pc,
                  replies: pc.replies.map((r) =>
                    r.id === c.id
                      ? { ...r, content: c.content, likes: c.likes }
                      : r
                  ),
                }
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [post.id, supabase]);

  const { execute: addExecute, status: addStatus } = useAction(
    addComment,
    {
      onSuccess: (res) => {
        setContent("");
        setReplyContent("");
        setReplyingTo(null);
        setErrorMessage(null);
      },
      onError: () => setErrorMessage("Failed to submit comment."),
    }
  );

  const { execute: likeExecute } = useAction(likeComment, {
    onError: () => setErrorMessage("Failed to like comment."),
  });

  if (!user) {
    return (
      <p className="text-gray-400">
        Please <a href="/auth/login" className="text-green-400 underline">log in</a> to view and post comments.
      </p>
    );
  }

  const { execute: replyExecute, status: replyStatus } = useAction(createCommentReply, {
    onSuccess: () => {
      setReplyContent("");
      setReplyingTo(null);
      setErrorMessage(null);
    },
    onError: () => setErrorMessage("Failed to post reply."),
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    addExecute({ postId: post.id, content });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="animate-pulse bg-black/20 h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  const renderCommentThread = (comment: ThreadedComment, depth = 0) => (
    <div
      key={comment.id}
      className={depth > 0 ? "pl-4 border-l border-green-500/10" : ""}
    >
      <Card className="bg-black/20 backdrop-blur-sm border-green-500/10 mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            {comment.profile.avatar_url ? (
              <img
                src={comment.profile.avatar_url}
                alt={comment.profile.username}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <User size={16} className="text-green-400" />
              </div>
            )}
            <div className="flex flex-col flex-1">
              <p className="font-medium text-white">
                {comment.profile.username}
              </p>
              <p className="text-sm text-gray-400">
                {formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <Button
              onClick={() =>
                replyExecute({
                  postId: post.id,
                  content: replyContent,
                  parentCommentId: comment.id,
                })
              }
              disabled={replyStatus === "executing"}
            >
              {replyStatus === "executing" ? "Sending..." : "Send Reply"}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setComments((prev) =>
                  prev.map((c) =>
                    c.id === comment.id
                      ? { ...c, likes: (c.likes ?? 0) + 1 }
                      : c
                  )
                );
                likeExecute({ commentId: comment.id });
              }}
            >
              <ThumbsUp size={16} />
              <span className="ml-1">{comment.likes}</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {comment.content}
          </p>
        </CardContent>
      </Card>

      {/* reply form */}
      {replyingTo === comment.id && (
        <div className="ml-12 mb-4 space-y-2">
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <Textarea
            placeholder="Write a reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="bg-black/60 border-green-500/30 text-white min-h-[80px]"
          />
          <Button
            onClick={() =>
              addExecute({
                postId: post.id,
                content: replyContent,
                parentCommentId: comment.id,
              })
            }
            disabled={addStatus === "executing"}
          >
            Send Reply
          </Button>
        </div>
      )}

      {comment.replies.length > 0 && (
        <div className="space-y-4">
          {comment.replies.map((reply) =>
            renderCommentThread(reply, depth + 1)
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="border-t border-green-500/20 pt-8">
      <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
        <MessageCircle className="text-green-400" />
        Comments ({comments.length})
      </h3>

      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      {/* comment form */}
      <Card className="bg-black/40 backdrop-blur-sm border-green-500/20 mb-8">
        <CardHeader>
          <h4 className="text-lg font-medium text-white">Leave a Comment</h4>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Share your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-black/60 border-green-500/30 text-white placeholder-gray-400 focus:border-green-400 min-h-[100px]"
              required
            />
            <Button
              type="submit"
              disabled={addStatus === "executing"}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Send size={16} className="mr-2" />
              {addStatus === "executing" ? "Posting..." : "Post Comment"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* comments */}
      <div className="space-y-6">
        {comments.length === 0 && (
          <div className="text-center py-8">
            <MessageCircle size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        )}
        {comments.map((comment) => renderCommentThread(comment))}
      </div>
    </div>
  );
}
