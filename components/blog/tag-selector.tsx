"use client";

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAllTags } from '@/lib/client-actions/blog-data';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function TagSelector({
  selectedTags,
  onTagsChange,
  searchQuery,
  onSearchChange
}: TagSelectorProps) {
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    async function loadTags() {
      const tags = await getAllTags();
      setAllTags(tags || []);
    }

    loadTags();
  }, []);

  useEffect(() => {
    // Animate tag cloud
    gsap.fromTo('.tag-item',
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        stagger: 0.05,
        ease: "back.out(1.7)"
      }
    );
  }, [allTags]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    onTagsChange([]);
    onSearchChange('');
  };

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6 mb-8">
      <h2 className="text-lg font-semibold text-white mb-4">
        Filter & Search
      </h2>

      {/* Search Input */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-black/60 border-green-500/30 text-white placeholder-gray-400 focus:border-green-400"
        />
      </div>

      {/* Active Filters */}
      {(selectedTags.length > 0 || searchQuery) && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Active Filters:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-green-400 hover:text-green-300 h-auto p-0"
            >
              Clear all
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge
                variant="outline"
                className="bg-green-500/20 text-green-300 border-green-500/40"
              >
                Search: "{searchQuery}"
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-4 w-4 p-0"
                  onClick={() => onSearchChange('')}
                >
                  <X size={12} />
                </Button>
              </Badge>
            )}
            {selectedTags.map(tag => (
              <Badge
                key={tag}
                variant="outline"
                className="bg-green-500/20 text-green-300 border-green-500/40"
              >
                {tag}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-4 w-4 p-0"
                  onClick={() => toggleTag(tag)}
                >
                  <X size={12} />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Tag Cloud */}
      <div className="space-y-2">
        <span className="text-sm text-gray-400">Available Tags:</span>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={cn(
                  "tag-item px-3 py-1 rounded-full text-sm transition-all duration-200 border",
                  isSelected
                    ? "bg-green-500/30 text-green-200 border-green-400/60 scale-105"
                    : "bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20 hover:border-green-400/50"
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}