"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Eye, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BlogPost } from "@/types/types";
import { useAction } from "next-safe-action/hooks";
import { createPost } from "@/lib/actions/posts/create-post";
import { editPost } from "@/lib/actions/posts/edit-post";

interface PostEditorProps {
  post?: BlogPost;
  mode: "create" | "edit";
}

type EditorData = {
  title: string;
  summary: string;
  content: string;
  tags: string[];
  keywords: string[];
  author: string;
  readTime: number;
  featured: boolean;
  status: "draft" | "published";
};

export function PostEditor({ post, mode }: PostEditorProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<EditorData>({
    title: post?.title || "",
    summary: post?.summary || "",
    content: post?.content || "",
    tags: post?.tags?.map((t) => t.name) || [],
    keywords: post?.keywords || [],
    author: post?.author || "",
    readTime: post?.readTime || 5,
    featured: post?.featured || false,
    status: post?.status || "draft",
  });
  const [newTag, setNewTag] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-calc read time
  useEffect(() => {
    const words = formData.content.trim().split(/\s+/).length;
    setFormData((f) => ({
      ...f,
      readTime: Math.max(1, Math.ceil(words / 200)),
    }));
  }, [formData.content]);

  // Server actions
  const { execute: doCreate } = useAction(createPost, {
    onSuccess: () => router.push("/"),
    onError: () => setError("Failed to create post"),
  });
  const { execute: doEdit } = useAction(editPost, {
    onSuccess: () => router.push(`/blog/${post!.id}`),
    onError: () => setError("Failed to update post"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const payload = {
      title: formData.title,
      summary: formData.summary,
      content: formData.content,
      tags: formData.tags,
      keywords: formData.keywords,
      featured: formData.featured,
      status: formData.status,
    };

    if (mode === "create") {
      doCreate(payload);
    } else {
      doEdit({ postId: post!.id, ...payload });
    }
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData((f) => ({ ...f, tags: [...f.tags, newTag] }));
      setNewTag("");
    }
  };

  const removeTag = (tag: string) =>
    setFormData((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));

  const addKeyword = () => {
    if (newKeyword && !formData.keywords.includes(newKeyword)) {
      setFormData((f) => ({
        ...f,
        keywords: [...f.keywords, newKeyword],
      }));
      setNewKeyword("");
    }
  };

  const removeKeyword = (kw: string) =>
    setFormData((f) => ({
      ...f,
      keywords: f.keywords.filter((k) => k !== kw),
    }));

  if (preview) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl text-white font-bold">Preview</h1>
          <Button variant="outline" onClick={() => setPreview(false)}>
            <X size={16} /> Close
          </Button>
        </div>
        <article className="prose prose-invert prose-green">
          <h1 className="text-4xl text-white mb-2">{formData.title}</h1>
          <p className="text-gray-300 mb-4">{formData.summary}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {formData.tags.map((t) => (
              <Badge key={t}>{t}</Badge>
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
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl text-white font-bold">
          {mode === "create" ? "Create Post" : "Edit Post"}
        </h1>
        <Button variant="outline" onClick={() => setPreview(true)}>
          <Eye size={16} /> Preview
        </Button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card className="bg-black/40 backdrop-blur-sm border-green-500/20">
          <CardHeader>
            <h2 className="text-xl font-semibold text-white">
              Basic Information
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Title *
              </label>
              <Input
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, title: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Summary *
              </label>
              <Textarea
                required
                rows={3}
                value={formData.summary}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, summary: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Author
                </label>
                <Input
                  value={formData.author}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, author: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Read Time
                </label>
                <Input
                  type="number"
                  min={1}
                  value={formData.readTime}
                  onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      readTime: +e.target.value || 1,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Status
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(v: "draft" | "published") =>
                    setFormData((f) => ({ ...f, status: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, featured: e.target.checked }))
                }
              />
              <label className="text-sm text-gray-300">Featured</label>
            </div>
          </CardContent>
        </Card>

        {/* Tags & Keywords */}
        <Card className="bg-black/40 backdrop-blur-sm border-green-500/20">
          <CardHeader>
            <h2 className="text-xl font-semibold text-white">
              Tags & Keywords
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Tags</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                />
                <Button onClick={addTag} variant="outline">
                  <Plus size={16} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((t) => (
                  <Badge
                    key={t}
                    className="cursor-pointer"
                    onClick={() => removeTag(t)}
                  >
                    {t} <X size={12} />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Keywords
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addKeyword())
                  }
                />
                <Button onClick={addKeyword} variant="outline">
                  <Plus size={16} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.keywords.map((k) => (
                  <Badge
                    key={k}
                    className="cursor-pointer"
                    onClick={() => removeKeyword(k)}
                  >
                    {k} <X size={12} />
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <Card className="bg-black/40 backdrop-blur-sm border-green-500/20">
          <CardHeader>
            <h2 className="text-xl font-semibold text-white">Content</h2>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={12}
              value={formData.content}
              onChange={(e) =>
                setFormData((f) => ({ ...f, content: e.target.value }))
              }
              className="font-mono"
              required
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 text-white"
          >
            <Save size={16} className="mr-2" />
            {isSubmitting
              ? "Saving..."
              : mode === "create"
                ? "Create Post"
                : "Update Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}


interface BasicInfoProps {
  data: typeof PostEditor.prototype["formData"];
  setData: React.Dispatch<React.SetStateAction<typeof PostEditor.prototype["formData"]>>;
}

{/* function BasicInfoSection({ data, setData }: BasicInfoProps) {
  return (
    <Card className="bg-black/40 border-green-500/20">
      <CardHeader>
        <h2 className="text-xl text-white">Basic Information</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-gray-300">Title *</label>
          <Input
            required
            value={data.title}
            onChange={(e) => setData((d) => ({ ...d, title: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-gray-300">Summary *</label>
          <Textarea
            required
            rows={3}
            value={data.summary}
            onChange={(e) => setData((d) => ({ ...d, summary: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-gray-300">Author</label>
            <Input
              value={data.author}
              onChange={(e) => setData((d) => ({ ...d, author: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-gray-300">Read Time</label>
            <Input
              type="number"
              min={1}
              value={data.readTime}
              onChange={(e) =>
                setData((d) => ({ ...d, readTime: +e.target.value || 1 }))
              }
            />
          </div>
          <div>
            <label className="text-gray-300">Status</label>
            <Select
              value={data.status}
              onValueChange={(v: "draft" | "published") =>
                setData((d) => ({ ...d, status: v }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.featured}
            onChange={(e) => setData((d) => ({ ...d, featured: e.target.checked }))}
          />
          <label className="text-gray-300">Featured</label>
        </div>
      </CardContent>
    </Card>
  );
} */}

interface TagsKeywordsProps {
  tags: string[];
  newTag: string;
  setNewTag: (t: string) => void;
  addTag: () => void;
  removeTag: (t: string) => void;
  keywords: string[];
  newKeyword: string;
  setNewKeyword: (k: string) => void;
  addKeyword: () => void;
  removeKeyword: (k: string) => void;
}

{/* function TagsKeywordsSection({
  tags,
  newTag,
  setNewTag,
  addTag,
  removeTag,
  keywords,
  newKeyword,
  setNewKeyword,
  addKeyword,
  removeKeyword,
}: TagsKeywordsProps) {
  return (
    <Card className="bg-black/40 border-green-500/20">
      <CardHeader>
        <h2 className="text-xl text-white">Tags & Keywords</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-gray-300">Tags</label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            />
            <Button onClick={addTag} variant="outline">
              <Plus size={16} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <Badge key={t} onClick={() => removeTag(t)}>
                {t} <X size={12} />
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <label className="text-gray-300">Keywords</label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addKeyword())
              }
            />
            <Button onClick={addKeyword} variant="outline">
              <Plus size={16} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {keywords.map((k) => (
              <Badge key={k} onClick={() => removeKeyword(k)}>
                {k} <X size={12} />
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} */}

interface ContentEditorProps {
  content: string;
  setContent: (c: string) => void;
}

{/* function ContentEditor({ content, setContent }: ContentEditorProps) {
  return (
    <Card className="bg-black/40 border-green-500/20">
      <CardHeader>
        <h2 className="text-xl text-white">Content *</h2>
      </CardHeader>
      <CardContent>
        <Textarea
          rows={12}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="bg-black/60 border-green-500/30 text-white font-mono"
          placeholder="Write Markdown content..."
          required
        />
      </CardContent>
    </Card>
  );
} */}
