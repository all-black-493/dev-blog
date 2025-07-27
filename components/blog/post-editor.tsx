"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Eye, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BlogPost, createPost, updatePost } from '@/types/types';
import { cn } from '@/lib/utils';

interface PostEditorProps {
  post?: BlogPost;
  mode: 'create' | 'edit';
}

export function PostEditor({ post, mode }: PostEditorProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: post?.title || '',
    summary: post?.summary || '',
    content: post?.content || '',
    tags: post?.tags || [],
    keywords: post?.keywords || [],
    author: post?.author || 'Senior Developer',
    readTime: post?.readTime || 5,
    featured: post?.featured || false,
    status: post?.status || 'draft' as 'draft' | 'published'
  });

  const [newTag, setNewTag] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    setIsSubmitting(true);
    try {
      if (mode === 'create') {
        await createPost(formData);
        router.push('/');
      } else if (post) {
        await updatePost(post.id, formData);
        router.push(`/blog/${post.id}`);
      }
    } catch (error) {
      console.error('Failed to save post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addKeyword = () => {
    if (newKeyword && !formData.keywords.includes(newKeyword)) {
      setFormData(prev => ({ ...prev, keywords: [...prev.keywords, newKeyword] }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(keyword => keyword !== keywordToRemove)
    }));
  };

  // Auto-calculate read time based on content length
  useEffect(() => {
    const wordCount = formData.content.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute
    setFormData(prev => ({ ...prev, readTime }));
  }, [formData.content]);

  if (preview) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Preview</h1>
          <Button
            onClick={() => setPreview(false)}
            variant="outline"
            className="border-green-500/30 text-green-300 hover:bg-green-500/10"
          >
            <X size={16} className="mr-2" />
            Close Preview
          </Button>
        </div>

        <article className="prose prose-invert prose-green max-w-none">
          <h1 className="text-4xl font-bold text-white mb-4">{formData.title}</h1>
          <p className="text-gray-300 text-lg mb-6">{formData.summary}</p>
          <div className="flex flex-wrap gap-2 mb-8">
            {formData.tags.map(tag => (
              <Badge key={tag} className="bg-green-500/20 text-green-300">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="whitespace-pre-wrap text-gray-300">
            {formData.content}
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">
          {mode === 'create' ? 'Create New Post' : 'Edit Post'}
        </h1>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => setPreview(true)}
            variant="outline"
            className="border-green-500/30 text-green-300 hover:bg-green-500/10"
          >
            <Eye size={16} className="mr-2" />
            Preview
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="bg-black/40 backdrop-blur-sm border-green-500/20">
          <CardHeader>
            <h2 className="text-xl font-semibold text-white">Basic Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-black/60 border-green-500/30 text-white placeholder-gray-400 focus:border-green-400"
                placeholder="Enter post title..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Summary *
              </label>
              <Textarea
                value={formData.summary}
                onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                className="bg-black/60 border-green-500/30 text-white placeholder-gray-400 focus:border-green-400"
                placeholder="Brief summary of the post..."
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Author
                </label>
                <Input
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  className="bg-black/60 border-green-500/30 text-white placeholder-gray-400 focus:border-green-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Read Time (min)
                </label>
                <Input
                  type="number"
                  value={formData.readTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, readTime: parseInt(e.target.value) || 5 }))}
                  className="bg-black/60 border-green-500/30 text-white placeholder-gray-400 focus:border-green-400"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'draft' | 'published') =>
                    setFormData(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger className="bg-black/60 border-green-500/30 text-white focus:border-green-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-green-500/30">
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                className="rounded border-green-500/30 bg-black/60 text-green-500 focus:ring-green-500"
              />
              <label htmlFor="featured" className="text-sm text-gray-300">
                Featured Post
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Tags and Keywords */}
        <Card className="bg-black/40 backdrop-blur-sm border-green-500/20">
          <CardHeader>
            <h2 className="text-xl font-semibold text-white">Tags & Keywords</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="bg-black/60 border-green-500/30 text-white placeholder-gray-400 focus:border-green-400"
                  placeholder="Add a tag..."
                />
                <Button
                  type="button"
                  onClick={addTag}
                  variant="outline"
                  className="border-green-500/30 text-green-300 hover:bg-green-500/10"
                >
                  <Plus size={16} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <Badge
                    key={tag.id}
                    className="bg-green-500/20 text-green-300 border-green-500/30 cursor-pointer hover:bg-red-500/20"
                    onClick={() => removeTag(tag.name)}
                  >
                    {tag.name} <X size={12} className="ml-1" />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Keywords (for SEO)
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  className="bg-black/60 border-green-500/30 text-white placeholder-gray-400 focus:border-green-400"
                  placeholder="Add a keyword..."
                />
                <Button
                  type="button"
                  onClick={addKeyword}
                  variant="outline"
                  className="border-green-500/30 text-green-300 hover:bg-green-500/10"
                >
                  <Plus size={16} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.keywords.map(keyword => (
                  <Badge
                    key={keyword}
                    variant="outline"
                    className="bg-green-500/10 text-green-400 border-green-500/30 cursor-pointer hover:bg-red-500/20"
                    onClick={() => removeKeyword(keyword)}
                  >
                    {keyword} <X size={12} className="ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <Card className="bg-black/40 backdrop-blur-sm border-green-500/20">
          <CardHeader>
            <h2 className="text-xl font-semibold text-white">Content *</h2>
            <p className="text-sm text-gray-400">
              Supports Markdown formatting. Use ``` for code blocks.
            </p>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="bg-black/60 border-green-500/30 text-white placeholder-gray-400 focus:border-green-400 font-mono"
              placeholder="Write your post content here..."
              rows={20}
              required
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="border-gray-500/30 text-gray-300 hover:bg-gray-500/10"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Save size={16} className="mr-2" />
            {isSubmitting ? 'Saving...' : (mode === 'create' ? 'Create Post' : 'Update Post')}
          </Button>
        </div>
      </form>
    </div>
  );
}