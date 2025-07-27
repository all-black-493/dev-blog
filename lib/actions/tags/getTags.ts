'use server';

import { createClient } from '@/supabase-utils/server';

export async function getAllTagsAction(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('tags').select('name');

  if (error) {
    console.error('[getAllTagsAction]', error.message);
    return [];
  }

  return data.map(tag => tag.name);
}
