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

interface BasicInfoProps {
  data: typeof PostEditor.prototype["formData"];
  setData: React.Dispatch<React.SetStateAction<typeof PostEditor.prototype["formData"]>>;
}

function BasicInfoSection({ data, setData }: BasicInfoProps) {
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
}