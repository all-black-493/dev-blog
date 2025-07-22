import { notFound } from 'next/navigation';
import { PostEditor } from '@/components/blog/post-editor';
import { getBlogPostById, blogPostsMetadata } from '@/lib/blog-data';

interface EditPostPageProps {
  params: {
    slug: string;
  };
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const post = getBlogPostById(params.slug);

  if (!post) {
    notFound();
  }

  return <PostEditor post={post} mode="edit" />;
}

export function generateStaticParams() {
  return blogPostsMetadata.map((post) => ({
    slug: post.id,
  }));
}