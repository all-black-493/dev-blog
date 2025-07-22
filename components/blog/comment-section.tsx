"use client";

import { useState } from 'react';
import { MessageCircle, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BlogPost, Comment, addComment } from '@/lib/blog-data';

interface CommentSectionProps {
  post: BlogPost;
}

export function CommentSection({ post }: CommentSectionProps) {
  const [comments, setComments] = useState(post.comments);
  const [newComment, setNewComment] = useState({ author: '', email: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.author || !newComment.email || !newComment.content) return;

    setIsSubmitting(true);
    try {
      const comment = await addComment(post.id, newComment);
      if (comment) {
        setComments(prev => [...prev, comment]);
        setNewComment({ author: '', email: '', content: '' });
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-t border-green-500/20 pt-8">
      <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
        <MessageCircle className="text-green-400" />
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      <Card className="bg-black/40 backdrop-blur-sm border-green-500/20 mb-8">
        <CardHeader>
          <h4 className="text-lg font-medium text-white">Leave a Comment</h4>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Your name"
                value={newComment.author}
                onChange={(e) => setNewComment(prev => ({ ...prev, author: e.target.value }))}
                className="bg-black/60 border-green-500/30 text-white placeholder-gray-400 focus:border-green-400"
                required
              />
              <Input
                type="email"
                placeholder="Your email"
                value={newComment.email}
                onChange={(e) => setNewComment(prev => ({ ...prev, email: e.target.value }))}
                className="bg-black/60 border-green-500/30 text-white placeholder-gray-400 focus:border-green-400"
                required
              />
            </div>
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment.content}
              onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
              className="bg-black/60 border-green-500/30 text-white placeholder-gray-400 focus:border-green-400 min-h-[100px]"
              required
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Send size={16} className="mr-2" />
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <Card key={comment.id} className="bg-black/20 backdrop-blur-sm border-green-500/10">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <User size={16} className="text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-white">{comment.author}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(comment.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed">{comment.content}</p>
            </CardContent>
          </Card>
        ))}
        
        {comments.length === 0 && (
          <div className="text-center py-8">
            <MessageCircle size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
}