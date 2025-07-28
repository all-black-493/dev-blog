'use client';

import { getAllTagsAction } from '@/lib/actions/tags/getTags';

export async function getAllTags(): Promise<string[]> {
  return await getAllTagsAction();
}
